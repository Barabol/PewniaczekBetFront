import { User, Wallet, LogOut, TrendingUp, Clock, UserPlus, UserMinus, Users, Github, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';
import { userService, oathService } from '../services';
import { useState, useEffect } from 'react';
import type { UserDto, OathDto } from '../types';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user, logout, refreshUser, connectGithub } = useAuth();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<OathDto[]>([]);
  const [followedIds, setFollowedIds] = useState<Set<number>>(new Set());
  const [followers, setFollowers] = useState<UserDto[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [communityTab, setCommunityTab] = useState<'all' | 'followers'>('all');

  const handleToggleVisibility = async () => {
    try {
      await userService.toggleVisibility();
      toast.success('Zmieniono widoczność profilu');
      refreshUser();
    } catch {
      toast.error('Nie udało się zmienić widoczności profilu');
    }
  };

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersPage, followedPage] = await Promise.all([
          userService.getAll(0, 50),
          userService.getFollowed(0, 50),
        ]);
        setAllUsers(usersPage?.content || []);
        setFollowedIds(new Set((followedPage?.content || []).map((u) => u.id)));
      } catch {
        toast.error('Nie udało się załadować listy użytkowników');
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchData();

    const fetchFollowers = async () => {
      try {
        const followersPage = await userService.getFollowers(0, 50);
        setFollowers(followersPage?.content || []);
      } catch (err) {
        console.error('Nie udało się pobrać obserwujących:', err);
      } finally {
        setLoadingFollowers(false);
      }
    };

    if (user?.id) {
      oathService.getAll(Number(user.id))
        .then(accounts => setSocialAccounts(accounts))
        .catch(err => console.error('Nie udało się pobrać połączonych kont:', err));
      fetchFollowers();
    }
  }, [user?.id]);

  const handleFollow = async (userId: number) => {
    try {
      await userService.follow(userId);
      setFollowedIds((prev) => new Set([...prev, userId]));
      toast.success('Zacząłeś obserwować użytkownika');
      refreshUser();
    } catch {
      toast.error('Nie udało się obserwować użytkownika');
    }
  };

  const handleUnfollow = async (userId: number) => {
    try {
      await userService.unfollow(userId);
      setFollowedIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
      toast.success('Przestałeś obserwować użytkownika');
      refreshUser();
    } catch {
      toast.error('Nie udało się przestać obserwować użytkownika');
    }
  };

  const handleDisconnectGithub = async () => {
    try {
      await oathService.deleteGithub();
      setSocialAccounts(prev => prev.filter(acc => acc.service.toLowerCase() !== 'github'));
      toast.success('Konto GitHub zostało odłączone');
    } catch {
      toast.error('Nie udało się odłączyć konta GitHub');
    }
  };

  const githubAccount = socialAccounts.find(acc => acc.service.toLowerCase() === 'github');

  const otherUsers = (allUsers ?? []).filter((u) => u.id !== Number(user?.id));

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="mb-6">Mój profil</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white mb-4">
                <User className="w-12 h-12" />
              </div>
              <h3 className="mb-1">{user?.name || 'Użytkownik'}</h3>
              <p className="text-sm text-muted-foreground">ID: #{user?.id || '00000000'}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleNavigate('wallet')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition text-left"
              >
                <Wallet className="w-5 h-5 text-muted-foreground" />
                <span>Portfel</span>
              </button>
              <button
                onClick={() => handleNavigate('history')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition text-left"
              >
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span>Historia</span>
              </button>
              {githubAccount ? (
                <button
                  onClick={handleDisconnectGithub}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-destructive/10 text-destructive transition text-left"
                >
                  <Github className="w-5 h-5" />
                  <div className="flex-1">
                    <span className="block text-sm font-medium">Odłącz Githuba</span>
                    <span className="block text-xs opacity-75 font-mono">@{githubAccount.login}</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={connectGithub}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition text-left"
                >
                  <Github className="w-5 h-5" />
                  <span>Podłącz Githuba!</span>
                </button>
              )}
              <button
                onClick={handleToggleVisibility}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition text-left"
              >
                {user?.public ? (
                  <>
                    <Eye className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <span className="block text-sm font-medium">Profil: Publiczny</span>
                      <span className="block text-xs opacity-75">Kliknij, aby ukryć profil</span>
                    </div>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="block text-sm font-medium">Profil: Prywatny</span>
                      <span className="block text-xs opacity-75">Kliknij, aby upublicznić</span>
                    </div>
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-destructive/10 text-destructive transition text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Wyloguj się</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-md p-6 border border-border mb-6">
            <h3 className="mb-4">Konto</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Saldo</div>
                  <div className="font-bold text-green-600">{(user?.balance ?? 0).toFixed(2)} PLN</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Freebet</div>
                  <div>{(user?.freeBetBalance ?? 0).toFixed(2)} PLN</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Typ konta</div>
                  <div>{user?.accountTypeId === 1 ? 'Premium' : 'Standard'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h3 className="mb-4">Statystyki</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">{user?.wins || 0}</div>
                <div className="text-sm text-muted-foreground mt-1">Wygrane</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-destructive">{user?.losses || 0}</div>
                <div className="text-sm text-muted-foreground mt-1">Przegrane</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">{(user?.winsAmount ?? 0).toFixed(0)}</div>
                <div className="text-sm text-muted-foreground mt-1">Wygrane (PLN)</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-destructive">{(user?.lossesAmount ?? 0).toFixed(0)}</div>
                <div className="text-sm text-muted-foreground mt-1">Przegrane (PLN)</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6 border border-border mt-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                <h3 className="text-base font-bold">Społeczność</h3>
              </div>
              <div className="flex gap-1 bg-muted p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setCommunityTab('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                    communityTab === 'all'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Wszyscy
                </button>
                <button
                  type="button"
                  onClick={() => setCommunityTab('followers')}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                    communityTab === 'followers'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Obserwujący mnie ({followers.length})
                </button>
              </div>
            </div>

            {communityTab === 'all' ? (
              loadingUsers ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-muted-foreground/20" />
                      <div className="flex-1">
                        <div className="h-4 bg-muted-foreground/20 rounded w-1/3 mb-1" />
                        <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : otherUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Brak innych użytkowników</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {otherUsers.map((u) => {
                    const isFollowed = followedIds.has(u.id);
                    return (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-bold text-sm">
                            {(u.name || '').charAt(0)}{(u.surname || '').charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{u.name} {u.surname}</div>
                            <div className="text-xs text-muted-foreground">
                              {u.wins} wygrane | {u.losses} przegrane
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => isFollowed ? handleUnfollow(u.id) : handleFollow(u.id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            isFollowed
                              ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                              : 'bg-green-600/10 text-green-600 hover:bg-green-600/20'
                          }`}
                        >
                          {isFollowed ? (
                            <><UserMinus className="w-3.5 h-3.5" /> Obserwujesz</>
                          ) : (
                            <><UserPlus className="w-3.5 h-3.5" /> Obserwuj</>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              loadingFollowers ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-muted-foreground/20" />
                      <div className="flex-1">
                        <div className="h-4 bg-muted-foreground/20 rounded w-1/3 mb-1" />
                        <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : followers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Brak obserwujących</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {followers.map((u) => {
                    const isFollowed = followedIds.has(u.id);
                    return (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-bold text-sm">
                            {(u.name || '').charAt(0)}{(u.surname || '').charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{u.name} {u.surname}</div>
                            <div className="text-xs text-muted-foreground">
                              {u.wins} wygrane | {u.losses} przegrane
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => isFollowed ? handleUnfollow(u.id) : handleFollow(u.id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            isFollowed
                              ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                              : 'bg-green-600/10 text-green-600 hover:bg-green-600/20'
                          }`}
                        >
                          {isFollowed ? (
                            <><UserMinus className="w-3.5 h-3.5" /> Obserwujesz</>
                          ) : (
                            <><UserPlus className="w-3.5 h-3.5" /> Obserwuj back</>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
