import { render, screen, fireEvent } from '@testing-library/react';
import WeightForm from '@/components/WeightForm';

describe('WeightForm', () => {
  test('submits valid weight and optional exercise details, then resets form', () => {
    const onAddWeight = jest.fn();
    render(<WeightForm onAddWeight={onAddWeight} />);

    const weightInput = screen.getByPlaceholderText('e.g. 74.5');
    fireEvent.change(weightInput, { target: { value: '76.4' } });

    const yesCheckbox = screen.getByRole('checkbox', { name: /yes/i });
    fireEvent.click(yesCheckbox);

    const detailsInput = screen.getByPlaceholderText(
      /5km run, weightlifting/i,
    );
    fireEvent.change(detailsInput, { target: { value: '  Weightlifting  ' } });

    fireEvent.click(screen.getByRole('button', { name: /add log/i }));

    expect(onAddWeight).toHaveBeenCalledTimes(1);
    expect(onAddWeight).toHaveBeenCalledWith(
      76.4,
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      true,
      'Weightlifting',
    );
    expect(weightInput).toHaveValue(null);
  });

  test('alerts and does not submit when weight is out of valid range', () => {
    const onAddWeight = jest.fn();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<WeightForm onAddWeight={onAddWeight} />);

    const weightInput = screen.getByPlaceholderText('e.g. 74.5');
    fireEvent.change(weightInput, { target: { value: '5' } });
    fireEvent.submit(weightInput.closest('form')!);

    expect(alertSpy).toHaveBeenCalled();
    expect(onAddWeight).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
