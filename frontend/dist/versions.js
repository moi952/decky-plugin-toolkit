const versionParts = (v) => v
    .replace(/^v/i, "")
    .split(".")
    .map((p) => parseInt(p, 10) || 0);
// Positive if a > b, negative if a < b, 0 if equal.
export const compareVersions = (a, b) => {
    const pa = versionParts(a);
    const pb = versionParts(b);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const x = pa[i] ?? 0;
        const y = pb[i] ?? 0;
        if (x !== y)
            return x - y;
    }
    return 0;
};
