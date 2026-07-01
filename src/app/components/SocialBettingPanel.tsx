import { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck } from 'lucide-react';
import { betService, userService } from '../services';
import type { UserWinBetDto } from '../types';
import { useAuth } from '../context';
import { useTranslation } from 'react-i18next';

interface GroupedBet {
  betId: number;
  match: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time?: string;
  bets: {
    type: 'home' | 'draw' | 'away';
    label: string;
    count: number;
    percentage: number;
    users: UserWinBetDto[];
  }[];
}

type FilterMode = 'all' | 'followed';

export function SocialBettingPanel() {
  const [groupedBets, setGroupedBets] = useState<GroupedBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const { isLoggedIn, user: currentUser } = useAuth();
  const { t } = useTranslation();

  const fetchSocialBets = useCallback(async () => {
    if (!isLoggedIn) {
      setGroupedBets([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let allBets: UserWinBetDto[] = [];

      if (filterMode === 'followed') {
        const followedPage = await userService.getFollowed(0, 20);
        const followedUsers = followedPage.content || [];

        if (followedUsers.length === 0) {
          setGroupedBets([]);
          return;
        }

        const results = await Promise.all(
          followedUsers.map((u) =>
            betService.getWinHistory(0, 5, u.id, undefined, false)
              .then((page) => page.content || [])
              .catch(() => [] as UserWinBetDto[])
          )
        );
        allBets = results.flat();
      } else {
        // Fetch all users and filter out the current user to get actual bets of others
        const usersPage = await userService.getAll(0, 50);
        const otherUsers = (usersPage.content || [])
          .filter((u) => String(u.id) !== currentUser?.id)
          .slice(0, 10); // Limit to 10 users to prevent network request flooding

        if (otherUsers.length === 0) {
          setGroupedBets([]);
          return;
        }

        const results = await Promise.all(
          otherUsers.map((u) =>
            betService.getWinHistory(0, 5, u.id, undefined, false)
              .then((page) => page.content || [])
              .catch(() => [] as UserWinBetDto[])
          )
        );
        allBets = results.flat();
      }

      if (allBets.length === 0) {
        setGroupedBets([]);
        return;
      }

      const grouped: GroupedBet[] = [];

      allBets.forEach((item) => {
        const bet = item.bet;
        const game = bet.game;
        const betId = bet.id;

        let group = grouped.find((g) => g.betId === betId);
        if (!group) {
          group = {
            betId,
            match: `${game?.team1 || 'Drużyna 1'} vs ${game?.team2 || 'Drużyna 2'}`,
            homeTeam: game?.team1 || 'Drużyna 1',
            awayTeam: game?.team2 || 'Drużyna 2',
            league: game?.sport || bet.name || 'Sport',
            time: 'LIVE',
            bets: [],
          };
          grouped.push(group);
        }

        const betType = item.team === group.homeTeam
          ? 'home'
          : item.team === group.awayTeam
            ? 'away'
            : 'draw';

        const label = betType === 'home'
          ? group.homeTeam
          : betType === 'away'
            ? group.awayTeam
            : 'X';

        let existingBet = group.bets.find((b) => b.type === betType);
        if (existingBet) {
          existingBet.count++;
          existingBet.users.push(item);
        } else {
          group.bets.push({
            type: betType,
            label,
            count: 1,
            percentage: 0,
            users: [item],
          });
        }
      });

      grouped.forEach((group) => {
        group.bets.sort((a, b) => b.count - a.count);
        const total = group.bets.reduce((sum, b) => sum + b.count, 0);
        group.bets = group.bets.map((b) => ({
          ...b,
          percentage: Math.round((b.count / total) * 100),
        }));
      });

      setGroupedBets(grouped);
    } catch {
      setGroupedBets([]);
    } finally {
      setLoading(false);
    }
  }, [filterMode]);

  useEffect(() => {
    fetchSocialBets();
    const interval = setInterval(fetchSocialBets, 30000);
    return () => clearInterval(interval);
  }, [fetchSocialBets]);

  const header = (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {filterMode === 'followed' ? (
          <UserCheck className="w-5 h-5 text-green-600" />
        ) : (
          <Users className="w-5 h-5 text-green-600" />
        )}
        <h3 className="font-semibold">{t('social_bets.title')}</h3>
      </div>
      {isLoggedIn && (
        <div className="flex bg-muted rounded-lg p-0.5 font-sans">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 text-xs rounded-md transition cursor-pointer ${
              filterMode === 'all'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t('social_bets.all')}
          </button>
          <button
            onClick={() => setFilterMode('followed')}
            className={`px-3 py-1 text-xs rounded-md transition flex items-center gap-1 cursor-pointer ${
              filterMode === 'followed'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            {t('social_bets.followed')}
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow-md border border-border p-4 sticky top-4">
        {header}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 bg-muted rounded-lg animate-pulse">
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (groupedBets.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-md border border-border p-4 sticky top-4">
        {header}
        <div className="text-center py-8 text-muted-foreground">
          {filterMode === 'followed' ? (
            <>
              <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t('social_bets.empty_followed')}</p>
              <p className="text-xs mt-1">{t('social_bets.empty_followed_desc')}</p>
            </>
          ) : (
            <>
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t('social_bets.empty')}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-md border border-border p-4 sticky top-4">
      {header}

      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {groupedBets.map((group) => (
          <div key={group.betId} className="p-4 bg-muted rounded-lg border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="text-sm font-medium truncate">
                  {group.homeTeam} vs {group.awayTeam}
                </div>
                <div className="text-xs text-muted-foreground">
                  {group.league}
                </div>
              </div>
              {group.time && (
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                  LIVE
                </span>
              )}
            </div>

            <div className="space-y-2">
              {group.bets.map((bet) => (
                <div key={bet.type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{bet.label}</span>
                    <span className="text-muted-foreground">
                      {bet.count} zakłady ({bet.percentage}%)
                    </span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={
                        `absolute left-0 top-0 h-full rounded-full transition-all ${bet.type === 'home' ? 'bg-green-600' : bet.type === 'away' ? 'bg-blue-600' : 'bg-yellow-600'}`
                      }
                      style={{ width: `${bet.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {group.bets.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">Obstawiają</div>
                <div className="flex flex-wrap gap-2">
                  {group.bets.flatMap((bet) =>
                    bet.users.slice(0, 3).map((userBet, userIdx) => (
                      <div
                        key={`${bet.type}-${userIdx}`}
                        className="flex items-center gap-1 bg-background rounded-full px-2 py-1 border border-border"
                      >
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-xs font-bold">
                          {userBet.user.name.charAt(0)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {userBet.multiplyer.toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                  {group.bets.some((b) => b.users.length > 3) && (
                    <div className="flex items-center gap-1 bg-muted rounded-full px-2 py-1">
                      <span className="text-xs text-muted-foreground">
                        +
                        {group.bets.reduce((sum, b) => sum + Math.max(0, b.users.length - 3), 0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}