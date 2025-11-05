/**
 * Linear Algebra Utilities for OLS Visualization
 * Implements numerically stable matrix operations, QR, SVD, and projections
 */

const LinAlg = {
    // Constants
    EPSILON: 1e-10,
    MAX_ITER: 100,

    /**
     * Create a matrix (2D array) filled with zeros
     */
    zeros: function(rows, cols) {
        return Array(rows).fill(0).map(() => Array(cols).fill(0));
    },

    /**
     * Create an identity matrix
     */
    identity: function(n) {
        const I = this.zeros(n, n);
        for (let i = 0; i < n; i++) I[i][i] = 1;
        return I;
    },

    /**
     * Matrix transpose
     */
    transpose: function(A) {
        const rows = A.length;
        const cols = A[0].length;
        const AT = this.zeros(cols, rows);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                AT[j][i] = A[i][j];
            }
        }
        return AT;
    },

    /**
     * Matrix multiplication: C = A * B
     */
    multiply: function(A, B) {
        const rowsA = A.length;
        const colsA = A[0].length;
        const colsB = B[0].length;
        const C = this.zeros(rowsA, colsB);

        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsB; j++) {
                let sum = 0;
                for (let k = 0; k < colsA; k++) {
                    sum += A[i][k] * B[k][j];
                }
                C[i][j] = sum;
            }
        }
        return C;
    },

    /**
     * Matrix-vector multiplication
     */
    matvec: function(A, x) {
        const m = A.length;
        const n = A[0].length;
        const y = Array(m).fill(0);

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                y[i] += A[i][j] * x[j];
            }
        }
        return y;
    },

    /**
     * Vector dot product
     */
    dot: function(a, b) {
        let sum = 0;
        for (let i = 0; i < a.length; i++) {
            sum += a[i] * b[i];
        }
        return sum;
    },

    /**
     * Vector norm (L2)
     */
    norm: function(v) {
        return Math.sqrt(this.dot(v, v));
    },

    /**
     * Normalize a vector
     */
    normalize: function(v) {
        const n = this.norm(v);
        if (n < this.EPSILON) return v.map(() => 0);
        return v.map(x => x / n);
    },

    /**
     * Vector addition
     */
    add: function(a, b) {
        return a.map((x, i) => x + b[i]);
    },

    /**
     * Vector subtraction
     */
    subtract: function(a, b) {
        return a.map((x, i) => x - b[i]);
    },

    /**
     * Scalar multiplication
     */
    scale: function(a, s) {
        return a.map(x => x * s);
    },

    /**
     * Cross product (3D only)
     */
    cross: function(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    },

    /**
     * Matrix addition
     */
    matAdd: function(A, B) {
        return A.map((row, i) => row.map((val, j) => val + B[i][j]));
    },

    /**
     * Matrix subtraction
     */
    matSubtract: function(A, B) {
        return A.map((row, i) => row.map((val, j) => val - B[i][j]));
    },

    /**
     * Solve 2x2 or 3x3 system using Gaussian elimination
     */
    solve: function(A, b) {
        const n = A.length;
        // Create augmented matrix
        const aug = A.map((row, i) => [...row, b[i]]);

        // Forward elimination with partial pivoting
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
                    maxRow = k;
                }
            }
            // Swap rows
            [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];

            // Make all rows below this one 0 in current column
            for (let k = i + 1; k < n; k++) {
                const c = aug[k][i] / aug[i][i];
                for (let j = i; j <= n; j++) {
                    if (i === j) {
                        aug[k][j] = 0;
                    } else {
                        aug[k][j] -= c * aug[i][j];
                    }
                }
            }
        }

        // Back substitution
        const x = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            x[i] = aug[i][n];
            for (let j = i + 1; j < n; j++) {
                x[i] -= aug[i][j] * x[j];
            }
            x[i] /= aug[i][i];
        }

        return x;
    },

    /**
     * Matrix inverse (using Gauss-Jordan for small matrices)
     */
    inverse: function(A) {
        const n = A.length;
        const aug = A.map((row, i) => [...row, ...this.identity(n)[i]]);

        // Forward elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
                    maxRow = k;
                }
            }
            [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];

            // Check for singularity
            if (Math.abs(aug[i][i]) < this.EPSILON) {
                return null; // Singular matrix
            }

            // Scale pivot row
            const pivot = aug[i][i];
            for (let j = 0; j < 2 * n; j++) {
                aug[i][j] /= pivot;
            }

            // Eliminate column
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const c = aug[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        aug[k][j] -= c * aug[i][j];
                    }
                }
            }
        }

        // Extract inverse
        return aug.map(row => row.slice(n));
    },

    /**
     * Determinant (for 2x2 and 3x3 matrices)
     */
    determinant: function(A) {
        const n = A.length;
        if (n === 1) return A[0][0];
        if (n === 2) {
            return A[0][0] * A[1][1] - A[0][1] * A[1][0];
        }
        if (n === 3) {
            return A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
                   A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
                   A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
        }
        // General case (cofactor expansion)
        let det = 0;
        for (let j = 0; j < n; j++) {
            det += A[0][j] * this.cofactor(A, 0, j);
        }
        return det;
    },

    /**
     * Cofactor for determinant calculation
     */
    cofactor: function(A, row, col) {
        return Math.pow(-1, row + col) * this.determinant(this.minor(A, row, col));
    },

    /**
     * Minor matrix (remove row and column)
     */
    minor: function(A, row, col) {
        return A.filter((_, i) => i !== row)
                .map(r => r.filter((_, j) => j !== col));
    },

    /**
     * QR Decomposition using Gram-Schmidt
     */
    qr: function(A) {
        const m = A.length;
        const n = A[0].length;
        const Q = this.zeros(m, n);
        const R = this.zeros(n, n);

        for (let j = 0; j < n; j++) {
            // Get column j of A
            let v = A.map(row => row[j]);

            // Orthogonalize against previous columns
            for (let i = 0; i < j; i++) {
                const q = Q.map(row => row[i]);
                R[i][j] = this.dot(q, v);
                v = this.subtract(v, this.scale(q, R[i][j]));
            }

            // Normalize
            R[j][j] = this.norm(v);
            if (R[j][j] > this.EPSILON) {
                const qj = this.scale(v, 1 / R[j][j]);
                for (let i = 0; i < m; i++) {
                    Q[i][j] = qj[i];
                }
            }
        }

        return { Q, R };
    },

    /**
     * Compute rank of matrix using QR decomposition
     */
    rank: function(A) {
        const { R } = this.qr(A);
        let rank = 0;
        const n = Math.min(R.length, R[0].length);
        for (let i = 0; i < n; i++) {
            if (Math.abs(R[i][i]) > this.EPSILON) {
                rank++;
            }
        }
        return rank;
    },

    /**
     * Condition number (2-norm, approximation)
     */
    conditionNumber: function(A) {
        // Simplified: use Frobenius norm as proxy
        const normA = this.frobeniusNorm(A);
        try {
            const ATA = this.multiply(this.transpose(A), A);
            const invATA = this.inverse(ATA);
            if (!invATA) return Infinity;
            const normInv = this.frobeniusNorm(invATA);
            return normA * Math.sqrt(normInv);
        } catch {
            return Infinity;
        }
    },

    /**
     * Frobenius norm
     */
    frobeniusNorm: function(A) {
        let sum = 0;
        for (let i = 0; i < A.length; i++) {
            for (let j = 0; j < A[0].length; j++) {
                sum += A[i][j] * A[i][j];
            }
        }
        return Math.sqrt(sum);
    },

    /**
     * Eigenvalues and eigenvectors for 2x2 matrix
     */
    eigen2x2: function(A) {
        const a = A[0][0], b = A[0][1];
        const c = A[1][0], d = A[1][1];

        // Characteristic equation: λ² - (a+d)λ + (ad-bc) = 0
        const trace = a + d;
        const det = a * d - b * c;
        const discriminant = trace * trace - 4 * det;

        if (discriminant < -this.EPSILON) {
            // Complex eigenvalues
            return null;
        }

        const sqrtDisc = Math.sqrt(Math.max(0, discriminant));
        const lambda1 = (trace + sqrtDisc) / 2;
        const lambda2 = (trace - sqrtDisc) / 2;

        // Eigenvectors
        const v1 = Math.abs(b) > this.EPSILON
            ? this.normalize([b, lambda1 - a])
            : this.normalize([lambda1 - d, c]);
        const v2 = Math.abs(b) > this.EPSILON
            ? this.normalize([b, lambda2 - a])
            : this.normalize([lambda2 - d, c]);

        return {
            values: [lambda1, lambda2],
            vectors: [v1, v2]
        };
    },

    /**
     * Project vector v onto subspace spanned by columns of U
     */
    project: function(v, U) {
        // proj_U(v) = U(U'U)^(-1)U'v
        const UT = this.transpose(U);
        const UTU = this.multiply(UT, U);
        const UTUinv = this.inverse(UTU);

        if (!UTUinv) {
            // Singular - use pseudoinverse approach
            return this.projectPseudo(v, U);
        }

        const UTv = this.matvec(UT, v);
        const coeffs = this.matvec(UTUinv, UTv);
        return this.matvec(U, coeffs);
    },

    /**
     * Pseudoinverse projection (for singular case)
     */
    projectPseudo: function(v, U) {
        // Use QR decomposition
        const { Q } = this.qr(U);
        const QT = this.transpose(Q);
        const coeffs = this.matvec(QT, v);
        return this.matvec(Q, coeffs);
    },

    /**
     * Projection matrix P = U(U'U)^(-1)U'
     */
    projectionMatrix: function(U) {
        const UT = this.transpose(U);
        const UTU = this.multiply(UT, U);
        const UTUinv = this.inverse(UTU);

        if (!UTUinv) return null;

        const UTUinvUT = this.multiply(UTUinv, UT);
        return this.multiply(U, UTUinvUT);
    },

    /**
     * OLS: Solve for β in y = Xβ
     */
    ols: function(X, y) {
        const XT = this.transpose(X);
        const XTX = this.multiply(XT, X);
        const XTy = this.matvec(XT, y);

        // Check for singularity
        const det = this.determinant(XTX);
        if (Math.abs(det) < this.EPSILON) {
            // Use QR decomposition
            return this.olsQR(X, y);
        }

        const XTXinv = this.inverse(XTX);
        if (!XTXinv) {
            return this.olsQR(X, y);
        }

        return this.matvec(XTXinv, XTy);
    },

    /**
     * OLS using QR decomposition (more stable)
     */
    olsQR: function(X, y) {
        const { Q, R } = this.qr(X);
        const QT = this.transpose(Q);
        const QTy = this.matvec(QT, y);

        // Solve R*beta = Q'y by back substitution
        const p = R[0].length;
        const beta = Array(p).fill(0);

        for (let i = p - 1; i >= 0; i--) {
            let sum = QTy[i];
            for (let j = i + 1; j < p; j++) {
                sum -= R[i][j] * beta[j];
            }
            if (Math.abs(R[i][i]) > this.EPSILON) {
                beta[i] = sum / R[i][i];
            }
        }

        return beta;
    },

    /**
     * Compute fitted values ŷ = Xβ
     */
    fitted: function(X, beta) {
        return this.matvec(X, beta);
    },

    /**
     * Compute residuals e = y - ŷ
     */
    residuals: function(y, yhat) {
        return this.subtract(y, yhat);
    },

    /**
     * Sum of squares
     */
    sumOfSquares: function(v) {
        return this.dot(v, v);
    },

    /**
     * Mean of vector
     */
    mean: function(v) {
        return v.reduce((a, b) => a + b, 0) / v.length;
    },

    /**
     * Center a vector (subtract mean)
     */
    center: function(v) {
        const m = this.mean(v);
        return v.map(x => x - m);
    },

    /**
     * R-squared
     */
    rSquared: function(y, yhat) {
        const ybar = this.mean(y);
        const tss = this.sumOfSquares(y.map(yi => yi - ybar));
        const rss = this.sumOfSquares(this.subtract(y, yhat));
        return 1 - rss / tss;
    },

    /**
     * Adjusted R-squared
     */
    adjRSquared: function(y, yhat, p) {
        const n = y.length;
        const r2 = this.rSquared(y, yhat);
        return 1 - (1 - r2) * (n - 1) / (n - p);
    },

    /**
     * Standard error of regression
     */
    sigma: function(y, yhat, p) {
        const n = y.length;
        const rss = this.sumOfSquares(this.subtract(y, yhat));
        return Math.sqrt(rss / (n - p));
    },

    /**
     * Standard errors of coefficients
     */
    standardErrors: function(X, sigma) {
        const XT = this.transpose(X);
        const XTX = this.multiply(XT, X);
        const XTXinv = this.inverse(XTX);

        if (!XTXinv) return null;

        const se = [];
        for (let i = 0; i < XTXinv.length; i++) {
            se.push(sigma * Math.sqrt(XTXinv[i][i]));
        }
        return se;
    },

    /**
     * t-statistics for coefficients
     */
    tStats: function(beta, se) {
        return beta.map((b, i) => b / se[i]);
    },

    /**
     * p-values from t-statistics (two-tailed)
     */
    tPValues: function(tStats, df) {
        return tStats.map(t => {
            // Using approximation for t-distribution CDF
            const p = this.tCDF(Math.abs(t), df);
            return 2 * (1 - p);
        });
    },

    /**
     * Approximation of t-distribution CDF
     */
    tCDF: function(t, df) {
        // Using normal approximation for df > 30
        if (df > 30) {
            return this.normalCDF(t);
        }
        // Simplified approximation for smaller df
        const x = df / (df + t * t);
        return 1 - 0.5 * Math.pow(x, df / 2);
    },

    /**
     * Standard normal CDF (approximation)
     */
    normalCDF: function(x) {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x > 0 ? 1 - p : p;
    },

    /**
     * F-statistic for nested models
     */
    fStatistic: function(rss0, rss1, df0, df1, n) {
        const num = (rss0 - rss1) / (df1 - df0);
        const denom = rss1 / (n - df1);
        return num / denom;
    },

    /**
     * Hat matrix H = X(X'X)^(-1)X'
     */
    hatMatrix: function(X) {
        return this.projectionMatrix(X);
    },

    /**
     * Leverage values (diagonal of hat matrix)
     */
    leverage: function(X) {
        const H = this.hatMatrix(X);
        if (!H) return null;
        return H.map((row, i) => row[i]);
    },

    /**
     * Cook's distance
     */
    cooksDistance: function(e, h, p, sigma) {
        return e.map((ei, i) => {
            const hi = h[i];
            return (ei * ei) / (p * sigma * sigma) * hi / Math.pow(1 - hi, 2);
        });
    },

    /**
     * Parse matrix from string (space-separated columns, newline-separated rows)
     */
    parseMatrix: function(str) {
        return str.trim().split('\n').map(row =>
            row.trim().split(/\s+/).map(Number)
        );
    },

    /**
     * Format matrix for display
     */
    formatMatrix: function(A, decimals = 3) {
        return A.map(row =>
            '[' + row.map(x => x.toFixed(decimals)).join(', ') + ']'
        ).join('\n');
    },

    /**
     * Format vector for display
     */
    formatVector: function(v, decimals = 3) {
        return '[' + v.map(x => x.toFixed(decimals)).join(', ') + ']';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LinAlg;
}
