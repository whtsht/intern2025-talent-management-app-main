#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AppStack } from "../lib/app-stack";
import { PermanentResourcesStack } from "../lib/permanent-resources-stack";
import { WafStack } from "../lib/waf-stack";
import { withPrefix } from "../lib/commons";

const app = new cdk.App();

const permanentResourcesStack = new PermanentResourcesStack(app, 'PermanentResourcesStack', {
  stackName: withPrefix('PermanentResourcesStack'),
});

const wafStack = new WafStack(app, "WafStack", {
  stackName: withPrefix('WafStack'),
  env: {
    region: 'us-east-1'
  },
});

const appStack = new AppStack(app, "AppStack", {
  stackName: withPrefix('ApplicationStack'),
  webAclArn: wafStack.webAclArn,
  crossRegionReferences: true,
  env: {
    // Cross stack/region references are only supported for stacks with an explicit region defined.
    region: process.env.CDK_DEFAULT_REGION
  },

  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
appStack.addDependency(permanentResourcesStack);
