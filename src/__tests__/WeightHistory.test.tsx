import { render, screen, fireEvent } from '@testing-library/react';
import WeightHistory from '@/components/WeightHistory';
import WeightStats from '@/components/WeightStats';
import { WeightEntry } from '@/types/weight';

const sampleLogs: WeightEntry[] = [
  {
    id: 'log-1',
    weight: 75.0,
    date: '2026-10-15',
    didExercise: true,
    exerciseDetails: '5km run',
  },
  {
    id: 'log-2',
    weight: 76.2,
    date: '2026-10-10',
    didExercise: false,
    exerciseDetails: '',
  },
];

describe('WeightStats & WeightHistory', () => {
  test('WeightStats displays latest weight and total logs count', () => {
    render(<WeightStats logs={sampleLogs} />);
    expect(screen.getByText('75 kg')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('WeightHistory shows empty message when there are no logs', () => {
    render(
      <WeightHistory
        logs={[]}
        onDeleteLog={jest.fn()}
        onEditLog={jest.fn()}
        onDeleteMultipleLogs={jest.fn()}
      />,
    );
    expect(
      screen.getByText(/No weight measurements logged yet/i),
    ).toBeInTheDocument();
  });

  test('WeightHistory renders entries, edits a log via modal, and deletes a log via modal', () => {
    const onDeleteLog = jest.fn();
    const onEditLog = jest.fn();
    const onDeleteMultipleLogs = jest.fn();

    render(
      <WeightHistory
        logs={sampleLogs}
        onDeleteLog={onDeleteLog}
        onEditLog={onEditLog}
        onDeleteMultipleLogs={onDeleteMultipleLogs}
      />,
    );

    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('76.2')).toBeInTheDocument();
    expect(screen.getByText(/5km run/i)).toBeInTheDocument();

    const editButtons = screen.getAllByTitle('Edit entry');
    fireEvent.click(editButtons[0]);

    const weightInput = screen.getByDisplayValue('75');
    fireEvent.change(weightInput, { target: { value: '74.8' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onEditLog).toHaveBeenCalledWith('log-1', {
      weight: 74.8,
      date: '2026-10-15',
      didExercise: true,
      exerciseDetails: '5km run',
    });

    const deleteButtons = screen.getAllByTitle('Delete entry');
    fireEvent.click(deleteButtons[0]);
    const allDeleteButtons = screen.getAllByRole('button', {
      name: /^delete$/i,
    });
    fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1]);

    expect(onDeleteLog).toHaveBeenCalledWith('log-1');
  });
});
