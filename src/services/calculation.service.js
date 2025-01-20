export class CalculationService {
    _RANKS = [
        "Absolute Beginner",
        "Beginner",
        "Inexperienced",
        "Rookie",
        "Novice",
        "Below Average",
        "Average",
        "Reasonable",
        "Above Average",
        "Competent",
        "Highly Competent",
        "Veteran",
        "Distinguished",
        "Highly Distinguished",
        "Professional",
        "Star",
        "Master",
        "Outstanding",
        "Celebrity",
        "Supreme",
        "Idolized",
        "Champion",
        "Heroic",
        "Legendary",
        "Elite",
        "Invincible",
    ];

    _LEVELS = [
        0,
        2,
        6,
        11,
        26,
        31,
        50,
        71,
        100,
    ];

    _NETWORTH = [
        0,
        5000000,
        50000000,
        500000000,
        5000000000,
        50000000000,
    ];

    _CRIMES_TOTAL = [
        0,
        100,
        5000,
        10000,
        20000,
        30000,
        50000
    ];

    calculate(rank, level, networth, crimesTotal) {
        const rankScore = this._getRankScore(rank) ?? 0;

        const statisticScore =
            this._getStatisticScore(level, this._LEVELS) +
            this._getStatisticScore(networth, this._NETWORTH) +
            this._getStatisticScore(crimesTotal, this._CRIMES_TOTAL);

        return Math.max(rankScore - statisticScore, 0);
    }

    _getRankScore(rank) {
        let score;
        this._RANKS.forEach((currentRank, index) => {
            if (rank.includes(currentRank)) {
                score = index;
            }
        });

        return score;
    }

    _getStatisticScore(statistic, statisticDelimiters) {
        let activeStatisticDelimiter;
        statisticDelimiters.forEach(delimiter => {
            if (statistic >= delimiter) {
                activeStatisticDelimiter = delimiter
            } else {
                return;
            }
        });

        return statisticDelimiters.indexOf(activeStatisticDelimiter);
    }
}