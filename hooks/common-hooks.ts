import { CustomWorld } from '../world';
import { reportPageErrors, reportFailedRequests, reportRecordedRequests } from '../stories';
import { Before, BeforeAll, AfterAll, setDefaultTimeout, After, Status } from '@cucumber/cucumber';
import { PlaywrightFluent } from 'playwright-fluent';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const isCI = require('is-ci');

setDefaultTimeout(120000);

Before({ tags: '@ignore' }, async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'skipped' as any;
});

Before({ tags: '@debug' }, async function (this: CustomWorld) {
  this.debug = true;
});

BeforeAll(async function () {
  // eslint-disable-next-line no-console
  console.log('Before All');
  // eslint-disable-next-line no-console
  isCI ? console.log('running in CI ...') : console.log('running on local machine ...');
});

/**
 * Before each scenario hook
 */
Before(async function (this: CustomWorld) {
  this.p = new PlaywrightFluent()
    .withBrowser('chromium')
    .recordPageErrors()
    .recordFailedRequests()
    .withCursor()
    .withOptions({ headless: true });
});

/**
 * Before each scenario hook
 */
Before({ tags: '@live' }, async function (this: CustomWorld) {
  this.live = true;
});

/**
 * Before each scenario hook
 */
Before({ tags: '@headfull' }, async function (this: CustomWorld) {
  // eslint-disable-next-line no-console
  console.log('running in headfull mode');
  this.p.withOptions({ headless: false });
});

/**
 * Before each scenario hook
 */
Before({ tags: '@live or @debug' }, async function (this: CustomWorld) {
  if (isCI) {
    // eslint-disable-next-line no-console
    console.log('tags @live and @debug are ignored on CI');
    return;
  }

  // eslint-disable-next-line no-console
  console.log('running in headfull mode when @live or @debug is set on the Scenario');
  this.p.withOptions({ headless: false });
});

/**
 * Before each scenario hook
 */
Before({ tags: '@recordRequests' }, async function (this: CustomWorld) {
  this.p.recordRequestsTo('/');
});

/**
 * After each scenario hook
 */
After(async function (this: CustomWorld, testCase: ITestCaseHookParameter) {
  if (testCase?.result?.status === Status.FAILED && this.p) {
    const screenshot: string = await this.p.takeFullPageScreenshotAsBase64();
    await this.attach(screenshot, 'image/png');
  }

  if (this.p && isCI) {
    await this.p.close();
    return;
  }

  if (this.live) {
    // do not close the browser
    return;
  }

  if (this.p) {
    await this.p.close();
  }
});

/**
 * After each scenario hook
 */
After(async function (this: CustomWorld) {
  await this.p.runStory(reportPageErrors, this);
  await this.p.runStory(reportFailedRequests, this);
  await this.p.runStory(reportRecordedRequests, this);
});

AfterAll(async function () {
  // eslint-disable-next-line no-console
  console.log('After All');
});
