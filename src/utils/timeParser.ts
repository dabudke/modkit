enum TimeLength {
    Year,
    Month,
    Week,
    Day,
    Hour,
    Minute
}

const timeMultipliers: Record<TimeLength,number> = {
    [TimeLength.Minute]:         60_000,
      [TimeLength.Hour]:      3_600_000,
       [TimeLength.Day]:     86_400_000,
      [TimeLength.Week]:    604_800_000,
     [TimeLength.Month]:  2_628_000_000,
      [TimeLength.Year]: 31_563_000_000
};

export function parseFuture(time: string,initialTime = Date.now()): Date | null {
    const delta = parse(time);
    if (isNaN(delta)) return null;
    return new Date(initialTime + delta);
}

export function parsePast(time: string,initialTime = Date.now()): Date | null {
    const delta = parse(time);
    if (isNaN(delta)) return null;
    const calc = initialTime - delta;
    if (calc < 0) return null;
    return new Date(calc);
}

export function parse(time: string): number {
    let output = 0, fail = false;
    const args = time.split(/ +/);
    args.forEach(v=>{
        if (fail) return;
        const number = parseInt(v.match(/\d+/)[0]), unit = matchLength(v.split(/\d+/)[1]), multiplier = timeMultipliers[unit];
        if (isNaN(number) || !unit || !multiplier || isNaN(multiplier)) { fail = true; return; }
        output += number * multiplier;
    });
    if (fail) return NaN;
    return output;
}

function matchLength(determiner:string): TimeLength {
    if (determiner.match(/^(y|[yY][rR][sS]?|[yY][eE][aA][rR][sS]?)$/)) return TimeLength.Year;
    if (determiner.match(/^(M|[mM][oO][nN](([sS])|([tT][hH][sS]?))?)$/)) return TimeLength.Month;
    if (determiner.match(/^(w|[wW][kK][sS]?|[wW][eE][eE][kK][sS]?)$/)) return TimeLength.Week;
    if (determiner.match(/^(d|[dD][yY][sS]?|[dD][aA][yY][sS]?)$/)) return TimeLength.Day;
    if (determiner.match(/^(h|[hH][rR][sS]?|[hH][oO][uU][rR][sS]?)$/)) return TimeLength.Hour;
    if (determiner.match(/^(m|[mM][iI][nN]([sS]|[uU][tT][eE][sS]?)?)$/)) return TimeLength.Minute;
    return undefined;
}
