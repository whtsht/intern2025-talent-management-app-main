import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import * as path from "path";
import { backendDynamoDBTableName } from "./permanent-resources-stack";
import { withPrefix } from "./commons";

export interface AppStackProps extends cdk.StackProps {
  webAclArn: string;
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    // Cognito User Pool
    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: withPrefix("UserPool"),
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Talent Management App - Email Verification",
        emailBody: "Please verify your email by clicking the link: {##Verify Email##}",
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // User Pool Client
    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool: userPool,
      userPoolClientName: withPrefix("UserPoolClient"),
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: ["http://localhost:3000/callback"],
      },
      refreshTokenValidity: cdk.Duration.days(30),
      accessTokenValidity: cdk.Duration.hours(1),
      idTokenValidity: cdk.Duration.hours(1),
    });

    // User Pool Domain
    const userPoolDomain = new cognito.UserPoolDomain(this, "UserPoolDomain", {
      userPool: userPool,
      cognitoDomain: {
        domainPrefix: withPrefix("auth").toLowerCase(),
      },
    });

    // Backend
    const backendFunctions = path.join(__dirname, "../../backend-ts");
    const backendDB = dynamodb.Table.fromTableName(this, "BackendDynamoDB", backendDynamoDBTableName());
    const backendFunctionLayer = new lambda.LayerVersion(this, "BackendFunctionLayer", {
      layerVersionName: withPrefix("BackendFunctionLayer"),
      code: lambda.Code.fromAsset(`${backendFunctions}/layers`),
    });
    const backendFunction = new lambda.Function(this, "BackendFunction", {
      functionName: withPrefix("BackendFunction"),
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "handlers.handle",
      code: lambda.Code.fromAsset(`${backendFunctions}/out`),
      environment: {
        EMPLOYEE_TABLE_NAME: backendDB.tableName,
      },
      logRetention: 30,
      layers: [backendFunctionLayer],
    });
    backendDB.grantReadWriteData(backendFunction);

    // Frontend
    const frontendBucket = new s3.Bucket(this, "FrontendBucket", {
      bucketName: withPrefix(this.account),
      // The frontend bucket doesn't contain any permanent resources.
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // API Gateway
    const api = new apigateway.RestApi(this, "Api", {
      restApiName: withPrefix("Api"),
      description: "Talent Management App API",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "X-Amz-User-Agent",
        ],
      },
    });

    // Cognito Authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, "ApiAuthorizer", {
      cognitoUserPools: [userPool],
      authorizerName: withPrefix("ApiAuthorizer"),
      identitySource: "method.request.header.Authorization",
    });

    // Lambda Integration
    const lambdaIntegration = new apigateway.LambdaIntegration(backendFunction, {
      requestTemplates: {
        "application/json": `{
          "httpMethod": "$context.httpMethod",
          "path": "$context.path",
          "queryStringParameters": {
            #foreach($param in $input.params().querystring.keySet())
            "$param": "$util.escapeJavaScript($input.params().querystring.get($param))"
            #if($foreach.hasNext),#end
            #end
          },
          "headers": {
            #foreach($header in $input.params().header.keySet())
            "$header": "$util.escapeJavaScript($input.params().header.get($header))"
            #if($foreach.hasNext),#end
            #end
          },
          "body": $input.json('$'),
          "requestContext": {
            "authorizer": {
              "claims": {
                "sub": "$context.authorizer.claims.sub",
                "email": "$context.authorizer.claims.email"
              }
            }
          }
        }`,
      },
      integrationResponses: [
        {
          statusCode: "200",
          responseHeaders: {
            "Access-Control-Allow-Origin": "'*'",
            "Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            "Access-Control-Allow-Methods": "'GET,POST,PUT,DELETE,OPTIONS'",
          },
        },
      ],
    });

    // API Resources
    const employeesResource = api.root.addResource("employees");
    const employeeResource = employeesResource.addResource("{id}");

    // Add methods with authentication
    employeesResource.addMethod("GET", lambdaIntegration, {
      authorizer: authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
      methodResponses: [
        {
          statusCode: "200",
          responseHeaders: {
            "Access-Control-Allow-Origin": true,
            "Access-Control-Allow-Headers": true,
            "Access-Control-Allow-Methods": true,
          },
        },
      ],
    });

    employeeResource.addMethod("GET", lambdaIntegration, {
      authorizer: authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
      methodResponses: [
        {
          statusCode: "200",
          responseHeaders: {
            "Access-Control-Allow-Origin": true,
            "Access-Control-Allow-Headers": true,
            "Access-Control-Allow-Methods": true,
          },
        },
      ],
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      webAclId: props.webAclArn,
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket, {
          originAccessLevels: [cloudfront.AccessLevel.READ],
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        "/api/*": {
          origin: origins.RestApiOrigin.withOriginAccessControl(api, {
            originAccessLevels: [cloudfront.AccessLevel.READ],
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: new cloudfront.OriginRequestPolicy(this, "OriginRequestPolicy", {
            originRequestPolicyName: withPrefix("OriginRequestPolicy"),
            queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
            headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList(
              "Authorization",
              "Content-Type",
              "X-Amz-Date",
              "X-Api-Key",
              "X-Amz-Security-Token",
              "X-Amz-User-Agent"
            ),
          }),
        },
      },
    });

    new cdk.CfnOutput(this, "FrontendBucketName", {
      exportName: withPrefix("FrontendBucketName"),
      value: frontendBucket.bucketName,
      description: "A name of the frontend bucket",
    });
    new cdk.CfnOutput(this, "DistributionDomainName", {
      exportName: withPrefix("DistributionDomainName"),
      value: distribution.domainName,
      description: "The domain name of the CloudFront distribution",
    });
    new cdk.CfnOutput(this, "UserPoolId", {
      exportName: withPrefix("UserPoolId"),
      value: userPool.userPoolId,
      description: "The ID of the Cognito User Pool",
    });
    new cdk.CfnOutput(this, "UserPoolClientId", {
      exportName: withPrefix("UserPoolClientId"),
      value: userPoolClient.userPoolClientId,
      description: "The ID of the Cognito User Pool Client",
    });
    new cdk.CfnOutput(this, "UserPoolDomain", {
      exportName: withPrefix("UserPoolDomain"),
      value: userPoolDomain.domainName,
      description: "The domain name of the Cognito User Pool",
    });
    new cdk.CfnOutput(this, "ApiUrl", {
      exportName: withPrefix("ApiUrl"),
      value: api.url,
      description: "The URL of the API Gateway",
    });
  }
}
