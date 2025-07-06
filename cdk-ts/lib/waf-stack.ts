import * as cdk from "aws-cdk-lib";
import * as wafv2 from "aws-cdk-lib/aws-wafv2";
import { Construct } from "constructs";
import { withPrefix } from "./commons";

export class WafStack extends cdk.Stack {
  public readonly webAclArn: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const webAcl = new wafv2.CfnWebACL(this, "WebACL", {
      scope: "CLOUDFRONT",
      defaultAction: { allow: {} },
      name: withPrefix("WebACL"),
      rules: [
        {
          name: "AWSManagedRulesCommonRuleSet",
          priority: 1,
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
          priority: 2,
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
          priority: 3,
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

    this.webAclArn = webAcl.attrArn;
  }
}
