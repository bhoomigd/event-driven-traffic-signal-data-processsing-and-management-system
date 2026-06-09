import type { Meta, StoryObj } from '@storybook/angular';
import { SwitchComponent } from '../app/components/switch.component/switch.component';

const meta: Meta<SwitchComponent> = {
  // The title defines where your story will be located in the Storybook sidebar
  title: 'UI/Switch',
  // The component to render for the stories
  component: SwitchComponent,
  // The tags enable automated documentation and other Storybook features
  tags: ['autodocs'],
  // This section allows you to define controls for the component's inputs
  argTypes: {
    isChecked: {
      control: 'boolean',
      description: 'The checked state of the switch.',
    },
    change: {
      action: 'change', // This logs the output event in the Storybook Actions panel
      description: 'Emits a boolean value when the switch state changes.',
    },
  },
  // Set default arguments for all stories
  args: {
    isChecked: false,
  },
};

export default meta;

type Story = StoryObj<SwitchComponent>;

// A default story for the switch in an unchecked state
export const Default: Story = {
  args: {
    isChecked: false,
  },
};

// A story for the switch in a checked state
export const Checked: Story = {
  args: {
    isChecked: true,
  },
};