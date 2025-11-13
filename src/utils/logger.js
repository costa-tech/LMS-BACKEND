/**
 * Logger Utility
 * Simple logging system for the application
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file paths
const errorLogPath = path.join(logsDir, 'error.log');
const combinedLogPath = path.join(logsDir, 'combined.log');

/**
 * Format log message with timestamp
 */
const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
};

/**
 * Write to log file
 */
const writeToFile = (filePath, message) => {
  try {
    fs.appendFileSync(filePath, message);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
};

/**
 * Logger object with different log levels
 */
const logger = {
  info: (message) => {
    const formattedMessage = formatMessage('info', message);
    console.log(`ℹ️  ${message}`);
    writeToFile(combinedLogPath, formattedMessage);
  },

  error: (message, error = null) => {
    const errorDetails = error ? `\n${error.stack || error}` : '';
    const formattedMessage = formatMessage('error', message + errorDetails);
    console.error(`❌ ${message}`, error || '');
    writeToFile(errorLogPath, formattedMessage);
    writeToFile(combinedLogPath, formattedMessage);
  },

  warn: (message) => {
    const formattedMessage = formatMessage('warn', message);
    console.warn(`⚠️  ${message}`);
    writeToFile(combinedLogPath, formattedMessage);
  },

  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = formatMessage('debug', message);
      console.log(`🔍 ${message}`);
      writeToFile(combinedLogPath, formattedMessage);
    }
  },

  success: (message) => {
    const formattedMessage = formatMessage('success', message);
    console.log(`✅ ${message}`);
    writeToFile(combinedLogPath, formattedMessage);
  }
};

export default logger;
