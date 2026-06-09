import { Meta, StoryFn } from '@storybook/angular';
import { ButtonComponent } from '../app/components/button.component/button.component';


export default {
  title: 'Components/Button',
  component: ButtonComponent,
  // The tags enable automated documentation and other Storybook features
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    buttonClass: { control: 'text' },
  },
} as Meta;

const Template: StoryFn<ButtonComponent> = (args: ButtonComponent) => ({
  component: ButtonComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  label: 'Primary Button',
  buttonClass: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Secondary Button',
  buttonClass: 'secondary',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled Button',
  buttonClass: 'disabled',
};