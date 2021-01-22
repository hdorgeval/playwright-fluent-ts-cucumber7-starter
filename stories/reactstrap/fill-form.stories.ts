import { StoryWithProps, PlaywrightFluent, Story, toRequestInfo } from 'playwright-fluent';
import expect from 'expect';

const selector = (p: PlaywrightFluent) => {
  return {
    formContainer: p.selector('div.docs-example').nth(1).find('form'),
  };
};
export const openPage: StoryWithProps<string> = async (p, pageName) => {
  // prettier-ignore
  const button = p
    .selector('div.container')
    .find('a')
    .withText(pageName)
    .nth(-1);

  await p.click(button);
};

export const openComponent: StoryWithProps<string> = async (p, componentName) => {
  // prettier-ignore
  const formComponent = p
    .selector('div.docs-sidebar')
    .find('li')
    .withText(componentName);

  await p.click(formComponent);
};

export interface InputTextInFieldProps {
  fieldLabel: string;
  text: string;
}
export const inputTextInField: StoryWithProps<InputTextInFieldProps> = async (p, props) => {
  const formContainer = selector(p).formContainer;
  const fieldLabel = formContainer.find('label').withText(props.fieldLabel);

  // prettier-ignore
  await p
    .click(fieldLabel)
    .typeText(props.text);
};

export interface SelectOptionsInFieldProps {
  fieldLabel: string;
  options: string;
}
export const selectOptionsInField: StoryWithProps<SelectOptionsInFieldProps> = async (p, props) => {
  const formContainer = selector(p).formContainer;
  const fieldLabel = formContainer.find('label').withText(props.fieldLabel);
  const optionsToSelect = props.options.split(',').map((option) => option.trim());

  // prettier-ignore
  await p
    .click(fieldLabel)
    .select(...optionsToSelect)
    .inFocused();
};

export const selectRadioButtonOption: StoryWithProps<string> = async (p, text) => {
  // prettier-ignore
  const formContainer = selector(p).formContainer;
  const fieldLabel = formContainer.find('input[type="radio"]').parent().withText(text);

  await p.click(fieldLabel);
};

export const checkOption: StoryWithProps<string> = async (p, text) => {
  const formContainer = selector(p).formContainer;
  const fieldInput = formContainer.find('label').withText(text).find('input[type="checkbox"]');

  await p.check(fieldInput);
};

export const submitForm: Story = async (p) => {
  const formContainer = selector(p).formContainer;
  const submitButton = formContainer.find('button').withText('Submit');

  await p.click(submitButton);
};

export interface KeyValue {
  key: string;
  value: string;
}
export const FormShouldBeSubmittedWithQueryParam: StoryWithProps<KeyValue> = async (p, props) => {
  await p.waitForStabilityOf(async () => await p.getRecordedRequestsTo('/?email').length);
  const submittedRequest = p.getLastRecordedRequestTo('/?email');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const request = await toRequestInfo(submittedRequest!);

  expect(request.queryString[props.key]).toBe(props.value);
};
