import { CustomWorld } from '../../world';
import { StoryWithProps } from 'playwright-fluent';

const stackTraceErrorsToIgnore = ['carbon.js', 'rate limit exceeded'];
function shouldIgnoreErrorByStacktrace(pageError: Error): boolean {
  if (pageError.stack) {
    return stackTraceErrorsToIgnore.some((fragment) => pageError.stack?.includes(fragment));
  }
  return false;
}

const messageErrorsToIgnore = ['foobar'];
function shouldIgnoreErrorByMessage(pageError: Error): boolean {
  if (pageError?.message) {
    return messageErrorsToIgnore.some((fragment) => pageError.message.includes(fragment));
  }
  return false;
}

function shouldKeepError(pageError: Error): boolean {
  if (shouldIgnoreErrorByStacktrace(pageError)) {
    return false;
  }

  if (shouldIgnoreErrorByMessage(pageError)) {
    return false;
  }

  return true;
}

export const reportPageErrors: StoryWithProps<CustomWorld> = async (p, world) => {
  const pageErrors = p.getPageErrors();
  const filteredErrors = pageErrors.filter(shouldKeepError);

  if (filteredErrors.length === 0) {
    return;
  }

  await world.attach(`${filteredErrors.length} Page Errors`);
  filteredErrors.forEach((pageError) => {
    const error = `
      ${pageError.name ? pageError.name : ''}
      ${pageError.message ? pageError.message : ''}
      ${pageError.stack ? pageError.stack : ''}
      --------------------------------------------------
    `;
    world.attach(error);
  });

  throw new Error(`There are ${filteredErrors.length} errors(s) in the page`);
};
