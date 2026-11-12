import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '../Button';

describe('Button', () => {
  it('renders its label and handles a press', async () => {
    const onPress = jest.fn();

    await render(<Button label="Continue" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire while disabled', async () => {
    const onPress = jest.fn();

    await render(<Button disabled label="Continue" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire while loading', async () => {
    const onPress = jest.fn();

    await render(<Button label="Saving" loading onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Saving' }));

    expect(onPress).not.toHaveBeenCalled();
  });
});
