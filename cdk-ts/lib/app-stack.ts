import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as wafv2 from "aws-cdk-lib/aws-wafv2";
import { Construct } from "constructs";
import * as path from "path";
import { backendDynamoDBTableName } from "./permanent-resources-stack";
import { withPrefix } from "./commons";

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

    // WAF Web ACL
    const webAcl = new wafv2.CfnWebACL(this, "WebACL", {
      scope: "CLOUDFRONT",
      defaultAction: { allow: {} },
      name: withPrefix("WebACL"),
      rules: [
        {
          name: "AWSManagedRulesCommonRuleSet",
          priority: 2,
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesCommonRuleSet",
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "CommonRuleSetMetric",
          },
        },
        {
          name: "AWSManagedRulesKnownBadInputsRuleSet",
          priority: 3,
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesKnownBadInputsRuleSet",
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "KnownBadInputsRuleSetMetric",
          },
        },
        {
          name: "AWSManagedRulesSQLiRuleSet",
          priority: 4,
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesSQLiRuleSet",
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "SQLiRuleSetMetric",
          },
        },
      ],
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: "WebACL",
      },
    });

    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      webAclId: webAcl.attrArn,
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket, {
          originAccessLevels: [cloudfront.AccessLevel.READ],
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        "/api/*": {
          origin: origins.FunctionUrlOrigin.withOriginAccessControl(
            backendFunction.addFunctionUrl({
              authType: lambda.FunctionUrlAuthType.AWS_IAM,
            })),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: new cloudfront.OriginRequestPolicy(this, "OriginRequestPolicy", {
            originRequestPolicyName: withPrefix("OriginRequestPolicy"),
            queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
          }),
        },
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/",
        },
      ],
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
  }
}
