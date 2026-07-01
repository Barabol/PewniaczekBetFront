import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MatchCard } from './MatchCard';
import userEvent from '@testing-library/user-event';

describe('MatchCard Component', () => {
  const defaultProps = {
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    time: '20:45',
    odds: {
      home: 2.1,
      draw: 3.4,
      away: 2.8,
    },
    isLive: false,
    betId: 101,
    betType: 'win' as const,
    onAddToBet: vi.fn(),
  };

  it('renders league, teams, time and odds', () => {
    render(<MatchCard {...defaultProps} />);
    expect(screen.getByText('La Liga')).toBeInTheDocument();
    expect(screen.getByText('Real Madrid')).toBeInTheDocument();
    expect(screen.getByText('Barcelona')).toBeInTheDocument();
    expect(screen.getByText('20:45')).toBeInTheDocument();
    expect(screen.getByText('2.10')).toBeInTheDocument();
    expect(screen.getByText('3.40')).toBeInTheDocument();
    expect(screen.getByText('2.80')).toBeInTheDocument();
  });

  it('shows LIVE badge when isLive is true', () => {
    render(<MatchCard {...defaultProps} isLive={true} />);
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('calls onAddToBet when home odds button is clicked', async () => {
    const onAddToBetMock = vi.fn();
    render(<MatchCard {...defaultProps} onAddToBet={onAddToBetMock} />);
    
    const homeOddsButton = screen.getByText('2.10');
    await userEvent.click(homeOddsButton);
    
    expect(onAddToBetMock).toHaveBeenCalledWith(
      'Real Madrid',
      2.1,
      'Real Madrid vs Barcelona',
      101,
      'win',
      'home'
    );
  });
});
