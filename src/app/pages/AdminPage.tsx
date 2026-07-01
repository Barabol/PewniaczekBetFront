import { useState, useEffect } from 'react';
import { Plus, Edit, Check, Settings, Calendar, TrendingUp, Activity, RefreshCw, Trophy, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { betService, adminService } from '../services';
import type { WinBetDto, ScoreBetDto, PredictionBetDto, GameDto, LogDto } from '../types';
import { toast } from 'sonner';
import { useAuth } from '../context';

const formatLocalDateTime = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 19);
};

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'create-bet' | 'create-prediction' | 'create-sport' | 'resolve' | 'update-score' | 'list' | 'logs'>('list');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const isActualAdmin =
    user?.accountTypeId === 3 ||
    user?.name?.toLowerCase().includes('admin') ||
    user?.surname?.toLowerCase().includes('admin');

  // Logs states
  const [logs, setLogs] = useState<LogDto[]>([]);
  const [logsPage, setLogsPage] = useState(0);
  const [logsTotalPages, setLogsTotalPages] = useState(0);
  const [logsLoading, setLogsLoading] = useState(false);

  // Lists of existing bets
  const [winBets, setWinBets] = useState<WinBetDto[]>([]);
  const [scoreBets, setScoreBets] = useState<ScoreBetDto[]>([]);
  const [predictionBets, setPredictionBets] = useState<PredictionBetDto[]>([]);

  // Form states - Bet (Win/Score)
  const [betType, setBetType] = useState<'win' | 'score'>('win');
  const [betId, setBetId] = useState('0');
  const [betName, setBetName] = useState('');
  const [multiplier, setMultiplier] = useState('2.0');
  const [stopDate, setStopDate] = useState('');
  
  // Game states
  const [gameId, setGameId] = useState('0');
  const [gameName, setGameName] = useState('');
  const [gameStartDate, setGameStartDate] = useState('');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [sport, setSport] = useState('piłka nożna');
  const [availableSports, setAvailableSports] = useState<string[]>(['piłka nożna', 'koszykówka', 'siatkówka', 'piłka ręczna', 'tenis', 'ping-pong']);
  const [newSportName, setNewSportName] = useState('');
  const [team1Score, setTeam1Score] = useState('0');
  const [team2Score, setTeam2Score] = useState('0');

  // Form states - Prediction Bet
  const [predId, setPredId] = useState('0');
  const [predName, setPredName] = useState('');
  const [predMultiplier, setPredMultiplier] = useState('1.8');
  const [predStartDate, setPredStartDate] = useState('');
  const [predStopDate, setPredStopDate] = useState('');
  const [trueBets, setTrueBets] = useState('0');
  const [falseBets, setFalseBets] = useState('0');
  const [trueBetsAmount, setTrueBetsAmount] = useState('0');
  const [falseBetsAmount, setFalseBetsAmount] = useState('0');
  const [predPot, setPredPot] = useState('0');
  const [predEndedWith, setPredEndedWith] = useState(false);

  // Form states - Resolve Prediction
  const [resolvePredId, setResolvePredId] = useState('');
  const [resolveValue, setResolveValue] = useState(true);

  // Form states - Update Game Score
  const [updateGameId, setUpdateGameId] = useState('');
  const [updateTeam1Score, setUpdateTeam1Score] = useState('0');
  const [updateTeam2Score, setUpdateTeam2Score] = useState('0');

  const fetchAllBets = async () => {
    setLoading(true);
    try {
      const [winRes, scoreRes, predRes] = await Promise.all([
        betService.getWinAll(undefined, 0, 50).catch(() => ({ content: [] })),
        betService.getScoreAll(undefined, 0, 50).catch(() => ({ content: [] })),
        betService.getPredictionAll(0, 50).catch(() => ({ content: [] })),
      ]);

      setWinBets(winRes?.content || []);
      setScoreBets(scoreRes?.content || []);
      setPredictionBets(predRes?.content || []);
    } catch {
      toast.error('Nie udało się pobrać listy zakładów');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (page = 0) => {
    setLogsLoading(true);
    try {
      const res = await adminService.getLogs(page, 10);
      setLogs(res.content || []);
      setLogsPage(res.number || 0);
      setLogsTotalPages(res.totalPages || 0);
    } catch (err: any) {
      toast.error(err.message || 'Nie udało się pobrać logów systemowych');
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const res = await betService.getWinSports();
      const sportNames = res.map((s) => s.sportName.toLowerCase());
      const defaultSports = ['piłka nożna', 'koszykówka', 'siatkówka', 'piłka ręczna', 'tenis', 'ping-pong'];
      const combined = Array.from(new Set([...defaultSports, ...sportNames]));
      setAvailableSports(combined);
    } catch {
      // Keep defaults on failure
    }
  };

  useEffect(() => {
    fetchAllBets();
    fetchSports();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs' && isActualAdmin) {
      fetchLogs(0);
    }
  }, [activeTab, isActualAdmin]);

  const handleAddWinOrScoreBet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!betName || !stopDate || !gameName || !gameStartDate || !team1 || !team2 || !sport) {
      toast.error('Uzupełnij wszystkie wymagane pola');
      return;
    }

    if (betName.length > 80) {
      toast.error('Nazwa zakładu nie może przekraczać 80 znaków');
      return;
    }
    if (gameName.length > 80) {
      toast.error('Nazwa meczu nie może przekraczać 80 znaków');
      return;
    }

    const gameDto: GameDto = {
      id: Number(gameId) || 0,
      name: gameName,
      startDate: formatLocalDateTime(gameStartDate),
      team1,
      team2,
      sport,
      team1Score: Number(team1Score) || 0,
      team2Score: Number(team2Score) || 0,
    };

    setLoading(true);
    try {
      if (betType === 'win') {
        const dto: WinBetDto = {
          id: Number(betId) || 0,
          name: betName,
          currentMultiplier: Number(multiplier) || 2.0,
          stopDate: formatLocalDateTime(stopDate),
          game: gameDto,
        };
        await betService.adminAddWinBet(dto);
        toast.success('Zakład 1X2 dodany/zaktualizowany pomyślnie');
      } else {
        const dto: ScoreBetDto = {
          id: Number(betId) || 0,
          name: betName,
          currentMultiplier: Number(multiplier) || 2.0,
          stopDate: formatLocalDateTime(stopDate),
          game: gameDto,
        };
        await betService.adminAddScoreBet(dto);
        toast.success('Zakład Dokładny Wynik dodany/zaktualizowany pomyślnie');
      }
      fetchAllBets();
      resetBetForm();
      setActiveTab('list');
    } catch (err: any) {
      toast.error(err.message || 'Nie udało się dodać zakładu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPredictionBet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!predName || !predStartDate || !predStopDate) {
      toast.error('Uzupełnij wszystkie wymagane pola');
      return;
    }

    if (predName.length > 80) {
      toast.error('Nazwa predykcji nie może przekraczać 80 znaków');
      return;
    }

    const dto: PredictionBetDto = {
      id: Number(predId) || 0,
      name: predName,
      currentMultiplier: Number(predMultiplier) || 1.8,
      startDate: formatLocalDateTime(predStartDate),
      stopDate: formatLocalDateTime(predStopDate),
      trueBets: Number(trueBets) || 0,
      falseBets: Number(falseBets) || 0,
      trueBetsAmount: Number(trueBetsAmount) || 0,
      falseBetsAmount: Number(falseBetsAmount) || 0,
      pot: Number(predPot) || 0,
      endedWith: predEndedWith,
    };

    setLoading(true);
    try {
      await betService.adminAddPredictionBet(dto);
      toast.success('Zakład prediction dodany/zaktualizowany pomyślnie');
      fetchAllBets();
      resetPredictionForm();
      setActiveTab('list');
    } catch (err: any) {
      toast.error(err.message || 'Nie udało się dodać prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSport = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSportName.trim().toLowerCase();
    if (!trimmed) {
      toast.error('Wpisz nazwę sportu');
      return;
    }
    if (trimmed.length > 30) {
      toast.error('Nazwa sportu nie może przekraczać 30 znaków');
      return;
    }
    if (availableSports.includes(trimmed)) {
      toast.error('Ten sport jest już na liście');
      return;
    }
    setAvailableSports((prev) => [...prev, trimmed]);
    setSport(trimmed);
    toast.success(`Sport "${trimmed}" został dodany do listy wyboru`);
    setNewSportName('');
    setActiveTab('create-bet');
  };

  const handleResolvePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvePredId) {
      toast.error('Podaj ID zakładu prediction');
      return;
    }

    setLoading(true);
    try {
      await betService.adminEndPredictionBet(Number(resolvePredId), resolveValue);
      toast.success(`Prediction #${resolvePredId} zostało rozstrzygnięte jako: ${resolveValue ? 'TAK' : 'NIE'}`);
      fetchAllBets();
      setResolvePredId('');
      setActiveTab('list');
    } catch (err: any) {
      toast.error(err.message || 'Nie udało się rozstrzygnąć prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGameScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateGameId) {
      toast.error('Podaj ID meczu');
      return;
    }

    setLoading(true);
    try {
      await betService.adminUpdateGameScore({
        gameId: Number(updateGameId),
        team1Score: Number(updateTeam1Score),
        team2Score: Number(updateTeam2Score),
      });
      toast.success(`Wynik meczu #${updateGameId} zaktualizowany na: ${updateTeam1Score} - ${updateTeam2Score}`);
      fetchAllBets();
      setUpdateGameId('');
      setActiveTab('list');
    } catch (err: any) {
      toast.error(err.message || 'Nie udało się zaktualizować wyniku');
    } finally {
      setLoading(false);
    }
  };

  const resetBetForm = () => {
    setBetId('0');
    setBetName('');
    setMultiplier('2.0');
    setStopDate('');
    setGameId('0');
    setGameName('');
    setGameStartDate('');
    setTeam1('');
    setTeam2('');
    setSport('piłka nożna');
    setTeam1Score('0');
    setTeam2Score('0');
  };

  const resetPredictionForm = () => {
    setPredId('0');
    setPredName('');
    setPredMultiplier('1.8');
    setPredStartDate('');
    setPredStopDate('');
    setTrueBets('0');
    setFalseBets('0');
    setTrueBetsAmount('0');
    setFalseBetsAmount('0');
    setPredPot('0');
    setPredEndedWith(false);
  };

  const populateEditBet = (bet: WinBetDto | ScoreBetDto, type: 'win' | 'score') => {
    setBetType(type);
    setBetId(String(bet.id));
    setBetName(bet.name || '');
    setMultiplier(String(bet.currentMultiplier));
    
    // Format stopDate (YYYY-MM-DDTHH:MM)
    if (bet.stopDate) {
      const date = new Date(bet.stopDate);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
      setStopDate(localISOTime);
    } else {
      setStopDate('');
    }

    if (bet.game) {
      setGameId(String(bet.game.id));
      setGameName(bet.game.name || '');
      setTeam1(bet.game.team1 || '');
      setTeam2(bet.game.team2 || '');
      setSport(bet.game.sport || 'piłka nożna');
      setTeam1Score(String(bet.game.team1Score || 0));
      setTeam2Score(String(bet.game.team2Score || 0));

      if (bet.game.startDate) {
        const date = new Date(bet.game.startDate);
        const tzOffset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
        setGameStartDate(localISOTime);
      } else {
        setGameStartDate('');
      }
    }

    setActiveTab('create-bet');
    toast.info(`Załadowano zakład #${bet.id} do edycji`);
  };

  const populateEditPrediction = (bet: PredictionBetDto) => {
    setPredId(String(bet.id));
    setPredName(bet.name || '');
    setPredMultiplier(String(bet.currentMultiplier));
    setTrueBets(String(bet.trueBets || 0));
    setFalseBets(String(bet.falseBets || 0));
    setTrueBetsAmount(String(bet.trueBetsAmount || 0));
    setFalseBetsAmount(String(bet.falseBetsAmount || 0));
    setPredPot(String(bet.pot || 0));
    setPredEndedWith(bet.endedWith || false);

    if (bet.startDate) {
      const date = new Date(bet.startDate);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
      setPredStartDate(localISOTime);
    } else {
      setPredStartDate('');
    }

    if (bet.stopDate) {
      const date = new Date(bet.stopDate);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
      setPredStopDate(localISOTime);
    } else {
      setPredStopDate('');
    }

    setActiveTab('create-prediction');
    toast.info(`Załadowano prediction #${bet.id} do edycji`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-7 h-7 text-green-600 animate-spin-slow" />
            Panel Administratora
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Zarządzaj zakładami, aktualizuj wyniki i rozstrzygaj rynki</p>
        </div>
        <button
          onClick={fetchAllBets}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted text-sm font-medium transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Odśwież dane
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
            activeTab === 'list'
              ? 'bg-green-600 text-white shadow-md shadow-green-600/10'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          }`}
        >
          Lista zakładów
        </button>
        <button
          onClick={() => { resetBetForm(); setActiveTab('create-bet'); }}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
            activeTab === 'create-bet'
              ? 'bg-green-600 text-white shadow-md shadow-green-600/10'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          }`}
        >
          Stwórz/Edytuj Zakład
        </button>
        <button
          onClick={() => { resetPredictionForm(); setActiveTab('create-prediction'); }}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
            activeTab === 'create-prediction'
              ? 'bg-green-600 text-white shadow-md shadow-green-600/10'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          }`}
        >
          Stwórz/Edytuj Prediction
        </button>
        <button
          onClick={() => setActiveTab('update-score')}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
            activeTab === 'update-score'
              ? 'bg-green-600 text-white shadow-md shadow-green-600/10'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          }`}
        >
          Aktualizuj Wynik Meczu
        </button>
        <button
          onClick={() => setActiveTab('resolve')}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
            activeTab === 'resolve'
              ? 'bg-green-600 text-white shadow-md shadow-green-600/10'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          }`}
        >
          Rozstrzygnij Prediction
        </button>
        <button
          onClick={() => setActiveTab('create-sport')}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
            activeTab === 'create-sport'
              ? 'bg-green-600 text-white shadow-md shadow-green-600/10'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          }`}
        >
          Dodaj Sport
        </button>
        {isActualAdmin && (
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-green-600 text-white shadow-md shadow-green-600/10'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            Logi systemowe
          </button>
        )}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 gap-6">

        {/* 1. LISTINGS TAB */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Win Bets & Score Bets */}
            <div className="bg-card rounded-lg border border-border shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Zakłady 1X2 (Win) & Dokładny Wynik (Score)
              </h3>
              
              {loading && winBets.length === 0 && scoreBets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Ładowanie zakładów...</div>
              ) : winBets.length === 0 && scoreBets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Brak zdefiniowanych zakładów meczowych.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-medium">
                        <th className="py-3 px-4">Typ</th>
                        <th className="py-3 px-4">ID Zakładu</th>
                        <th className="py-3 px-4">Nazwa / Mecz</th>
                        <th className="py-3 px-4">Sport</th>
                        <th className="py-3 px-4">Kurs</th>
                        <th className="py-3 px-4">Wynik</th>
                        <th className="py-3 px-4">Data zakończenia</th>
                        <th className="py-3 px-4 text-right">Akcje</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {winBets.map((bet) => (
                        <tr key={`win-${bet.id}`} className="hover:bg-muted/30 transition">
                          <td className="py-3 px-4 font-bold text-green-600">1X2</td>
                          <td className="py-3 px-4 text-muted-foreground">#{bet.id}</td>
                          <td className="py-3 px-4 font-medium">
                            {bet.game ? `${bet.game.team1} vs ${bet.game.team2}` : bet.name}
                            <span className="block text-xs text-muted-foreground font-normal">Mecz ID: #{bet.game?.id}</span>
                          </td>
                          <td className="py-3 px-4">{bet.game?.sport || 'Sport'}</td>
                          <td className="py-3 px-4 font-mono font-semibold">{bet.currentMultiplier.toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono">
                            {bet.game ? `${bet.game.team1Score} - ${bet.game.team2Score}` : '—'}
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">
                            {new Date(bet.stopDate).toLocaleString('pl-PL')}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => populateEditBet(bet, 'win')}
                              className="px-2 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs rounded font-medium transition cursor-pointer"
                            >
                              Edytuj
                            </button>
                            <button
                              onClick={() => {
                                setUpdateGameId(String(bet.game?.id || ''));
                                setUpdateTeam1Score(String(bet.game?.team1Score || 0));
                                setUpdateTeam2Score(String(bet.game?.team2Score || 0));
                                setActiveTab('update-score');
                              }}
                              className="px-2 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-xs rounded font-medium transition cursor-pointer"
                            >
                              Wynik
                            </button>
                          </td>
                        </tr>
                      ))}
                      {scoreBets.map((bet) => (
                        <tr key={`score-${bet.id}`} className="hover:bg-muted/30 transition">
                          <td className="py-3 px-4 font-bold text-orange-500">Wynik</td>
                          <td className="py-3 px-4 text-muted-foreground">#{bet.id}</td>
                          <td className="py-3 px-4 font-medium">
                            {bet.game ? `${bet.game.team1} vs ${bet.game.team2}` : bet.name}
                            <span className="block text-xs text-muted-foreground font-normal">Mecz ID: #{bet.game?.id}</span>
                          </td>
                          <td className="py-3 px-4">{bet.game?.sport || 'Sport'}</td>
                          <td className="py-3 px-4 font-mono font-semibold">{bet.currentMultiplier.toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono">
                            {bet.game ? `${bet.game.team1Score} - ${bet.game.team2Score}` : '—'}
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">
                            {new Date(bet.stopDate).toLocaleString('pl-PL')}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => populateEditBet(bet, 'score')}
                              className="px-2 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs rounded font-medium transition cursor-pointer"
                            >
                              Edytuj
                            </button>
                            <button
                              onClick={() => {
                                setUpdateGameId(String(bet.game?.id || ''));
                                setUpdateTeam1Score(String(bet.game?.team1Score || 0));
                                setUpdateTeam2Score(String(bet.game?.team2Score || 0));
                                setActiveTab('update-score');
                              }}
                              className="px-2 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-xs rounded font-medium transition cursor-pointer"
                            >
                              Wynik
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Prediction Bets */}
            <div className="bg-card rounded-lg border border-border shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Zakłady Społecznościowe (Predictions)
              </h3>
              
              {loading && predictionBets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Ładowanie predictions...</div>
              ) : predictionBets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Brak zdefiniowanych prediction.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-medium">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Nazwa pytania</th>
                        <th className="py-3 px-4">Kurs</th>
                        <th className="py-3 px-4">Pula (Pot)</th>
                        <th className="py-3 px-4">Głosy TAK/NIE</th>
                        <th className="py-3 px-4">Rozstrzygnięcie</th>
                        <th className="py-3 px-4">Koniec obstawiania</th>
                        <th className="py-3 px-4 text-right">Akcje</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {predictionBets.map((bet) => (
                        <tr key={`pred-${bet.id}`} className="hover:bg-muted/30 transition">
                          <td className="py-3 px-4 text-muted-foreground">#{bet.id}</td>
                          <td className="py-3 px-4 font-medium">{bet.name}</td>
                          <td className="py-3 px-4 font-mono font-semibold">{bet.currentMultiplier.toFixed(2)}</td>
                          <td className="py-3 px-4 font-mono">{bet.pot} PLN</td>
                          <td className="py-3 px-4 text-xs">
                            <span className="text-green-600 font-semibold">{bet.trueBets} ({bet.trueBetsAmount} PLN)</span> / <span className="text-red-500 font-semibold">{bet.falseBets} ({bet.falseBetsAmount} PLN)</span>
                          </td>
                          <td className="py-3 px-4">
                            {bet.endedWith === null ? (
                              <span className="text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded text-xs font-semibold">Trwa</span>
                            ) : bet.endedWith ? (
                              <span className="text-green-600 bg-green-500/10 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1 w-max">
                                <CheckCircle className="w-3.5 h-3.5" /> TAK
                              </span>
                            ) : (
                              <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1 w-max">
                                <XCircle className="w-3.5 h-3.5" /> NIE
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">
                            {new Date(bet.stopDate).toLocaleString('pl-PL')}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => populateEditPrediction(bet)}
                              className="px-2 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs rounded font-medium transition cursor-pointer"
                            >
                              Edytuj
                            </button>
                            <button
                              onClick={() => {
                                setResolvePredId(String(bet.id));
                                setActiveTab('resolve');
                              }}
                              className="px-2 py-1 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 text-xs rounded font-medium transition cursor-pointer"
                            >
                              Rozstrzygnij
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. FORM: CREATE/EDIT MATCH BET */}
        {activeTab === 'create-bet' && (
          <div className="bg-card rounded-lg border border-border shadow-md p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-border pb-3">
              <Plus className="w-5 h-5 text-green-600" />
              {Number(betId) > 0 ? `Edytuj Zakład #${betId}` : 'Dodaj Nowy Zakład Meczowy'}
            </h3>

            <form onSubmit={handleAddWinOrScoreBet} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Typ zakładu</label>
                  <select
                    value={betType}
                    onChange={(e) => setBetType(e.target.value as 'win' | 'score')}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                  >
                    <option value="win">1X2 (WinBet)</option>
                    <option value="score">Dokładny Wynik (ScoreBet)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">ID Zakładu (0 = nowy)</label>
                  <input
                    type="number"
                    value={betId}
                    onChange={(e) => setBetId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Mnożnik / Kurs początkowy</label>
                  <input
                    type="text"
                    value={multiplier}
                    onChange={(e) => setMultiplier(e.target.value)}
                    placeholder="2.0"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nazwa zakładu (np. Liga Mistrzów)</label>
                  <input
                    type="text"
                    value={betName}
                    onChange={(e) => setBetName(e.target.value)}
                    placeholder="np. Champions League"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Koniec przyjmowania zakładów</label>
                  <input
                    type="datetime-local"
                    value={stopDate}
                    onChange={(e) => setStopDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* GAME NESTED FORM */}
              <div className="border border-border bg-muted/20 rounded-lg p-5 space-y-4">
                <h4 className="font-semibold text-sm text-foreground border-b border-border pb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-green-600" />
                  Dane meczu (GameDto)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">ID Meczu (0 = nowy)</label>
                    <input
                      type="number"
                      value={gameId}
                      onChange={(e) => setGameId(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Dyscyplina (Sport)</label>
                    <select
                      value={sport}
                      onChange={(e) => setSport(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      required
                    >
                      {availableSports.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Nazwa meczu / turniej</label>
                    <input
                      type="text"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      placeholder="np. Real Madryt vs FC Barcelona"
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Gospodarze (Team 1)</label>
                    <input
                      type="text"
                      value={team1}
                      onChange={(e) => setTeam1(e.target.value)}
                      placeholder="np. Real Madryt"
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Goście (Team 2)</label>
                    <input
                      type="text"
                      value={team2}
                      onChange={(e) => setTeam2(e.target.value)}
                      placeholder="np. FC Barcelona"
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Data rozpoczęcia meczu</label>
                    <input
                      type="datetime-local"
                      value={gameStartDate}
                      onChange={(e) => setGameStartDate(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Gole/Punkty Gospodarzy (Team 1)</label>
                    <input
                      type="number"
                      value={team1Score}
                      onChange={(e) => setTeam1Score(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Gole/Punkty Gości (Team 2)</label>
                    <input
                      type="number"
                      value={team2Score}
                      onChange={(e) => setTeam2Score(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={resetBetForm}
                  className="px-5 py-2.5 border border-border rounded-lg bg-card hover:bg-muted text-sm font-medium transition cursor-pointer"
                >
                  Wyczyść formularz
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-md shadow-green-600/10 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Zapisz zakład
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. FORM: CREATE/EDIT PREDICTION */}
        {activeTab === 'create-prediction' && (
          <div className="bg-card rounded-lg border border-border shadow-md p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-border pb-3">
              <Plus className="w-5 h-5 text-green-600" />
              {Number(predId) > 0 ? `Edytuj Prediction #${predId}` : 'Dodaj Nowy Zakład Prediction (Pytanie)'}
            </h3>

            <form onSubmit={handleAddPredictionBet} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">ID Prediction (0 = nowe)</label>
                  <input
                    type="number"
                    value={predId}
                    onChange={(e) => setPredId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Mnożnik / Kurs początkowy</label>
                  <input
                    type="text"
                    value={predMultiplier}
                    onChange={(e) => setPredMultiplier(e.target.value)}
                    placeholder="1.8"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Budżet / Pula początkowa (Pot)</label>
                  <input
                    type="number"
                    value={predPot}
                    onChange={(e) => setPredPot(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Treść pytania (np. Czy Robert Lewandowski strzeli gola?)</label>
                <input
                  type="text"
                  value={predName}
                  onChange={(e) => setPredName(e.target.value)}
                  placeholder="np. Czy padnie więcej niż 2.5 bramki w meczu?"
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Start obstawiania</label>
                  <input
                    type="datetime-local"
                    value={predStartDate}
                    onChange={(e) => setPredStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Koniec obstawiania</label>
                  <input
                    type="datetime-local"
                    value={predStopDate}
                    onChange={(e) => setPredStopDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* STATS INITIAL CONFIG */}
              <div className="border border-border bg-muted/20 rounded-lg p-5 space-y-4">
                <h4 className="font-semibold text-sm text-foreground border-b border-border pb-2">
                  Statystyki zakładów (Opcjonalne dla nowych)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Ilość kuponów na TAK (trueBets)</label>
                    <input
                      type="number"
                      value={trueBets}
                      onChange={(e) => setTrueBets(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Ilość kuponów na NIE (falseBets)</label>
                    <input
                      type="number"
                      value={falseBets}
                      onChange={(e) => setFalseBets(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Kwota postawiona na TAK (trueBetsAmount)</label>
                    <input
                      type="number"
                      value={trueBetsAmount}
                      onChange={(e) => setTrueBetsAmount(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Kwota postawiona na NIE (falseBetsAmount)</label>
                    <input
                      type="number"
                      value={falseBetsAmount}
                      onChange={(e) => setFalseBetsAmount(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={resetPredictionForm}
                  className="px-5 py-2.5 border border-border rounded-lg bg-card hover:bg-muted text-sm font-medium transition cursor-pointer"
                >
                  Wyczyść formularz
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-md shadow-green-600/10 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Zapisz prediction
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. FORM: UPDATE GAME SCORE */}
        {activeTab === 'update-score' && (
          <div className="bg-card rounded-lg border border-border shadow-md p-6 max-w-xl mx-auto">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Activity className="w-5 h-5 text-blue-500" />
              Aktualizuj Wynik Meczu
            </h3>
            <p className="text-xs text-muted-foreground mb-6">Metoda ta zaktualizuje wynik dla gry w bazie danych (wywołanie endpointu /api/worker/game/update)</p>

            <form onSubmit={handleUpdateGameScore} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Mecz ID (gameId)</label>
                <input
                  type="number"
                  value={updateGameId}
                  onChange={(e) => setUpdateGameId(e.target.value)}
                  placeholder="np. 4"
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Gole Gospodarzy (Team 1)</label>
                  <input
                    type="number"
                    value={updateTeam1Score}
                    onChange={(e) => setUpdateTeam1Score(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Gole Gości (Team 2)</label>
                  <input
                    type="number"
                    value={updateTeam2Score}
                    onChange={(e) => setUpdateTeam2Score(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-600/10 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Zapisz wynik meczu
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 5. FORM: RESOLVE PREDICTION */}
        {activeTab === 'resolve' && (
          <div className="bg-card rounded-lg border border-border shadow-md p-6 max-w-xl mx-auto">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Check className="w-5 h-5 text-indigo-500" />
              Rozstrzygnij Prediction
            </h3>
            <p className="text-xs text-muted-foreground mb-6">Rozstrzyga zakład typu prediction i wysyła transakcje wygranych do użytkowników (wywołanie /api/worker/prediction/end)</p>

            <form onSubmit={handleResolvePrediction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">ID Zakładu (betId)</label>
                <input
                  type="number"
                  value={resolvePredId}
                  onChange={(e) => setResolvePredId(e.target.value)}
                  placeholder="np. 12"
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2.5">Ostateczny wynik pytania</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 p-3 border border-border rounded-lg bg-card hover:bg-muted/40 cursor-pointer flex-1 justify-center transition">
                    <input
                      type="radio"
                      checked={resolveValue === true}
                      onChange={() => setResolveValue(true)}
                      className="accent-green-600"
                    />
                    <span className="text-sm font-semibold text-green-600">TAK (True)</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-border rounded-lg bg-card hover:bg-muted/40 cursor-pointer flex-1 justify-center transition">
                    <input
                      type="radio"
                      checked={resolveValue === false}
                      onChange={() => setResolveValue(false)}
                      className="accent-red-500"
                    />
                    <span className="text-sm font-semibold text-red-500">NIE (False)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  Rozstrzygnij i zakończ
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 5B. CREATE SPORT TAB */}
        {activeTab === 'create-sport' && (
          <div className="bg-card rounded-lg border border-border shadow-md p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-border pb-3">
              <Plus className="w-5 h-5 text-green-600" />
              Dodaj Nową Dyscyplinę (Sport)
            </h3>

            <form onSubmit={handleAddSport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nazwa sportu</label>
                <input
                  type="text"
                  value={newSportName}
                  onChange={(e) => setNewSportName(e.target.value)}
                  placeholder="np. hokej, formula 1, rzutki"
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-md shadow-green-600/10 flex items-center gap-1.5 transition cursor-pointer"
                >
                  Dodaj do listy i przejdź do zakładu
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 6. SYSTEM LOGS TAB (ONLY FOR ADMIN) */}
        {activeTab === 'logs' && isActualAdmin && (
          <div className="bg-card rounded-lg border border-border shadow-md p-6">
            <div className="flex justify-between items-center mb-6 border-b border-border pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Logi Systemowe
              </h3>
              <button
                onClick={() => fetchLogs(logsPage)}
                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg bg-card hover:bg-muted text-xs font-medium transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${logsLoading ? 'animate-spin' : ''}`} />
                Odśwież logi
              </button>
            </div>
            
            {logsLoading && logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Ładowanie logów...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Brak zarejestrowanych logów.</div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                        <th className="py-3 px-4">Czas</th>
                        <th className="py-3 px-4">Użytkownik</th>
                        <th className="py-3 px-4">Akcja / Zdarzenie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs">
                      {logs.map((logItem, index) => (
                        <tr key={index} className="hover:bg-muted/20 transition">
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                            <span className="flex items-center gap-1.5 font-mono">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(logItem.time).toLocaleString('pl-PL')}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {logItem.user ? (
                              <div>
                                <span className="font-semibold text-foreground">
                                  {logItem.user.name} {logItem.user.surname}
                                </span>
                                <span className="block text-[10px] text-muted-foreground font-mono">
                                  ID: #{logItem.user.id} | {logItem.user.email}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground font-medium">System</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-foreground break-all whitespace-pre-wrap font-mono bg-muted/5">
                            {logItem.log}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {logsTotalPages > 1 && (
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <button
                      onClick={() => fetchLogs(logsPage - 1)}
                      disabled={logsPage === 0 || logsLoading}
                      className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Poprzednia
                    </button>
                    <span className="text-sm text-muted-foreground font-mono">
                      Strona {logsPage + 1} z {logsTotalPages}
                    </span>
                    <button
                      onClick={() => fetchLogs(logsPage + 1)}
                      disabled={logsPage === logsTotalPages - 1 || logsLoading}
                      className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Następna
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
