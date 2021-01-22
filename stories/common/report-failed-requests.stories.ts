import { CustomWorld } from '../../world';
import { StoryWithProps, Request, stringifyRequest } from 'playwright-fluent';

const urlsToBeIgnored: string[] = ['/fonts/', '/foobar/', '?callback=callback'];

function shouldKeepFailedRequest(failedRequest: Request): boolean {
  const url = failedRequest && failedRequest.url();
  const mustBeIgnored = urlsToBeIgnored.some((urlToBeIgnored) => url.includes(urlToBeIgnored));
  return !mustBeIgnored;
}

export const reportFailedRequests: StoryWithProps<CustomWorld> = async (p, world) => {
  const failedRequests = p.getFailedRequests();
  const fileteredRequests = failedRequests.filter(shouldKeepFailedRequest);

  if (fileteredRequests.length === 0) {
    return;
  }

  await world.attach(`${fileteredRequests.length} Failed Request(s)`);
  for (let index = 0; index < fileteredRequests.length; index++) {
    const failedRequest = fileteredRequests[index];
    const stringifiedRequest = await stringifyRequest(failedRequest);
    await world.attach(stringifiedRequest, 'application/json');
    await world.attach('-------------------------------------------------------');
  }

  throw new Error(`There are ${fileteredRequests.length} failed request(s)`);
};
