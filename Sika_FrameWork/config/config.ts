import dotenv from 'dotenv';
import { LaunchOptions } from '@playwright/test';

dotenv.config();

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
};

const BASE_URL = process.env.BASE_URL || 'http://leaftaps.com/opentaps/control/login';
const BROWSER = (process.env.BROWSER || 'chrome').toLowerCase();
const HEADLESS = parseBoolean(process.env.HEADLESS, false);
const VIDEO_ENABLED = parseBoolean(process.env.VIDEO_ENABLED, true);
const TRACE_ENABLED = parseBoolean(process.env.TRACE_ENABLED, true);
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Timeout values
const DEFAULT_TIMEOUT = 30000;
const STEP_TIMEOUT = 60000;

// use chromium | chrome | msedge | firefox | webkit
const SET_BROWSER = BROWSER;

// Browser configuration
const browserOptions: Record<string, LaunchOptions> = {
  chrome: {
    channel: 'chrome',
    headless: HEADLESS,
    args: [
      '--start-maximized',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-proxy-server'
    ],
    slowMo: 20
  },
  msedge: {
    channel: 'msedge',
    headless: HEADLESS,
    args: [
      '--start-maximized',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-proxy-server'
    ],
    slowMo: 20
  },
  firefox: {
    headless: HEADLESS,
    slowMo: 20,
    args: ['--kiosk'],
  },
  webkit: {
    headless: HEADLESS,
    slowMo: 20,
    args: ['--start-maximized'],
  },
};

// Screenshot, video, and trace options
const screenshotOptions = {
  takeOnFailure: true,
  takeOnSuccess: true,
  path: './reports/screenshots/'
};

const videoOptions = {
  enabled: VIDEO_ENABLED,
  path: './reports/videos/'
};

const traceOptions = {
  enabled: TRACE_ENABLED,
  path: './reports/traces/'
};

// Data storage paths
const dataPaths = {
  csv: './test-data/',
  json: './test-data/',
  excel: './test-data/'
};

export {
  BASE_URL,
  BROWSER,
  HEADLESS,
  VIDEO_ENABLED,
  TRACE_ENABLED,
  LOG_LEVEL,
  SET_BROWSER,
  DEFAULT_TIMEOUT,
  STEP_TIMEOUT,
  browserOptions,
  screenshotOptions,
  videoOptions,
  traceOptions,
  dataPaths
};