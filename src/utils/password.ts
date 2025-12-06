import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Hash a password using Node.js native crypto (scrypt)
 * @param password - Plain text password
 * @returns Hashed password in format: salt.hash
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}.${derivedKey.toString('hex')}`;
}

/**
 * Compare a plain text password with a hashed password
 * @param candidatePassword - Plain text password to verify
 * @param hashedPassword - Hashed password in format: salt.hash
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(
    candidatePassword: string,
    hashedPassword: string
): Promise<boolean> {
    try {
        const [salt, hash] = hashedPassword.split('.');
        const derivedKey = (await scryptAsync(candidatePassword, salt, 64)) as Buffer;
        const hashBuffer = Buffer.from(hash, 'hex');
        return timingSafeEqual(derivedKey, hashBuffer);
    } catch (error) {
        return false;
    }
}
