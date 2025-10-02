# Decompiled with PyLingual (https://pylingual.io)
# Internal filename: iq_indicator_signal_multi_thread_firebase_5M_V1.6.py
# Bytecode version: 3.12.0rc2 (3531)
# Source timestamp: 1970-01-01 00:00:00 UTC (0)

import logging
import time
from datetime import datetime, timezone, timedelta
import threading
import concurrent.futures
import firebase_admin
from firebase_admin import credentials, firestore
import numpy as np
import pandas as pd
from my_iqoptionapi.stable_api import IQ_Option
import sys
import os
from concurrent.futures import as_completed

def resource_path(relative_path):
    """Get absolute path to resource, works for dev and for PyInstaller"""  # inserted
    try:
        base_path = sys._MEIPASS
    except Exception:
        pass  # postinserted
    else:  # inserted
        return os.path.join(base_path, relative_path)
        base_path = os.path.abspath('.')

def get_base_path():
    """\n    Get the base path for the application, whether it\'s running as a script\n    or as a frozen executable compiled by PyInstaller.\n    """  # inserted
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

def load_asset_maps_from_excel(xlsx_filename='Asset.xlsx'):
    """\n    อ่านไฟล์ Asset.xlsx แล้วคืนค่า:\n      - asset_otc: Dict[str, str]  -> {\"<Asset>\": \"<Name>\"}\n      - asset_op:  Dict[str, str]  -> {\"<Asset>\": \"<Name>\"}\n      - asset_name_map: รวมสอง dict ข้างบน (ใช้ lookup ชื่อแสดงผล/ส่ง firebase)\n    หมายเหตุ: ต้องมีคอลัมน์ \'Asset\' และ \'Name\' ในแต่ละชีท\n    """  # inserted
    base_path = get_base_path()
    path = os.path.join(base_path, xlsx_filename)
    try:
        xls = pd.read_excel(path, sheet_name=None, dtype=str)
    except FileNotFoundError:
        pass  # postinserted
    else:  # inserted
        def to_map(df):
            df = df[['Asset', 'Name']].dropna()
            df['Asset'] = df['Asset'].str.strip()
            df['Name'] = df['Name'].str.strip()
            return dict(zip(df['Asset'], df['Name']))
        asset_otc = to_map(xls['OTC'])
        asset_op = to_map(xls['op'])
        asset_name_map = {**asset_op, **asset_otc}
        return (asset_otc, asset_op, asset_name_map)
        logging.error(f'หาไฟล์ \'{xlsx_filename}\' ไม่พบ! กรุณาวางไฟล์ไว้ที่เดียวกับโปรแกรม .exe')
        sys.exit(f'Critical Error: Missing \'{xlsx_filename}\'. Exiting.')

def support_and_resistance(candles_df, box_period=25):
    """\n    คำนวณแนวรับและแนวต้านตามตรรกะของ Lua script ที่ให้มา\n    Args:\n        candles_df (pd.DataFrame): DataFrame ของข้อมูลแท่งเทียนซึ่งมีคอลัมน์ \'max\' และ \'min\'\n        box_period (int): ระยะเวลาสำหรับคำนวณ high สูงสุดและ low ต่ำสุด\n\n    Returns:\n        pd.DataFrame: DataFrame ที่มีคอลัมน์ \'resistance\' และ \'support\'\n    """  # inserted
    df = candles_df.copy()
    df['highest_high'] = df['max'].rolling(window=box_period).max()
    df['lowest_low'] = df['min'].rolling(window=box_period).min()
    df['resistance_points'] = np.where(df['max'] >= df['highest_high'], df['max'], np.nan)
    df['support_points'] = np.where(df['min'] <= df['lowest_low'], df['min'], np.nan)
    df['resistance'] = df['resistance_points'].ffill()
    df['support'] = df['support_points'].ffill()
    return df[['resistance', 'support']]

def donchian_channel(candles_df, period=20):
    """\n    คำนวณ Donchian Channel\n    Args:\n        candles_df (pd.DataFrame): DataFrame ของข้อมูลแท่งเทียนซึ่งมีคอลัมน์ \'max\' และ \'min\'\n        period (int): ระยะเวลาสำหรับคำนวณ Channel\n\n    Returns:\n        pd.DataFrame: DataFrame ที่มีคอลัมน์ \'upper_dc\', \'middle_dc\', \'lower_dc\'\n    """  # inserted
    df = candles_df.copy()
    df['upper_dc'] = df['max'].rolling(window=period).max()
    df['lower_dc'] = df['min'].rolling(window=period).min()
    df['middle_dc'] = (df['upper_dc'] + df['lower_dc']) / 2
    return df[['upper_dc', 'middle_dc', 'lower_dc']]

def bollinger_bands(candles_df, period=14, std_dev=2):
    """\n    คำนวณ Bollinger Bands\n    Args:\n        candles_df (pd.DataFrame): DataFrame ของข้อมูลแท่งเทียนซึ่งมีคอลัมน์ \'close\'\n        period (int): ระยะเวลาสำหรับ Moving Average\n        std_dev (int): จำนวน Standard Deviations\n\n    Returns:\n        pd.DataFrame: DataFrame ที่มีคอลัมน์ \'middle_bb\', \'upper_bb\', \'lower_bb\'\n    """  # inserted
    df = candles_df.copy()
    df['middle_bb'] = df['close'].rolling(window=period).mean()
    df['std'] = df['close'].rolling(window=period).std()
    df['upper_bb'] = df['middle_bb'] + df['std'] * std_dev
    df['lower_bb'] = df['middle_bb'] - df['std'] * std_dev
    return df[['middle_bb', 'upper_bb', 'lower_bb']]

def stochastic_oscillator(candles_df, k_period=13, smooth_period=3, d_period=3):
    """\n    คำนวณ Stochastic Oscillator (Slow Stochastic) ตามตรรกะของ Lua script\n    Args:\n        candles_df (pd.DataFrame): DataFrame ของข้อมูลแท่งเทียนซึ่งมีคอลัมน์ \'max\', \'min\', \'close\'\n        k_period (int): ระยะเวลาสำหรับคำนวณช่วง Low ต่ำสุด และ High สูงสุด (Lua: k_period)\n        smooth_period (int): ระยะเวลาสำหรับ Smoothing %K เพื่อทำให้เป็น Slow Stochastic (Lua: smooth)\n        d_period (int): ระยะเวลาสำหรับ Moving Average ของ %K (เพื่อคำนวณ %D) (Lua: d_period)\n\n    Returns:\n        pd.DataFrame: DataFrame ที่มีคอลัมน์ \'%K\' และ \'%D\'\n    """  # inserted
    df = candles_df.copy()
    df['lowest_low'] = df['min'].rolling(window=k_period).min()
    df['highest_high'] = df['max'].rolling(window=k_period).max()
    raw_K = 100 * ((df['close'] - df['lowest_low']) / (df['highest_high'] - df['lowest_low']))
    df['%K'] = raw_K.rolling(window=smooth_period).mean()
    df['%D'] = df['%K'].rolling(window=d_period).mean()
    return df[['%K', '%D']]

def relative_strength_index(candles_df, period=14):
    """\n    คำนวณ Relative Strength Index (RSI)\n    Args:\n        candles_df (pd.DataFrame): DataFrame ของข้อมูลแท่งเทียนซึ่งมีคอลัมน์ \'close\'\n        period (int): ระยะเวลาสำหรับคำนวณ RSI\n\n    Returns:\n        pd.Series: Series ที่มีค่า RSI\n    """  # inserted
    df = candles_df.copy()
    delta = df['close'].diff()
    gain = delta.copy()
    loss = delta.copy()
    gain[gain < 0] = 0
    loss[loss > 0] = 0
    avg_gain = gain.ewm(com=period - 1, min_periods=period).mean()
    avg_loss = abs(loss.ewm(com=period - 1, min_periods=period).mean())
    rs = avg_gain / avg_loss
    rsi = 100 - 100 / (1 + rs)
    return rsi.rename('RSI')

def consecutive_candle_colors(candles_df):
    """\n    นับจำนวนแท่งเทียนสีเดียวกันที่เรียงติดกัน\n    Args:\n        candles_df (pd.DataFrame): DataFrame ของข้อมูลแท่งเทียนซึ่งมีคอลัมน์ \'open\' และ \'close\'\n\n    Returns:\n        pd.Series: Series ที่แสดงจำนวนแท่งเทียนสีเดียวกันติดต่อกัน (บวกสำหรับเขียว, ลบสำหรับแดง)\n    """  # inserted
    df = candles_df.copy()
    df['color'] = np.where(df['close'] > df['open'], 'green', np.where(df['close'] < df['open'], 'red', 'doji'))
    consecutive_counts = []
    current_count = 0
    for i in range(len(df)):
        if i > 0 and df['color'].iloc[i] == df['color'].iloc[i - 1] and (df['color'].iloc[i]!= 'doji'):
            if df['color'].iloc[i] == 'green':
                current_count = abs(current_count) + 1
            else:  # inserted
                current_count = -(abs(current_count) + 1)
        else:  # inserted
            if df['color'].iloc[i] == 'green':
                current_count = 1
            else:  # inserted
                if df['color'].iloc[i] == 'red':
                    current_count = (-1)
                else:  # inserted
                    current_count = 0
        consecutive_counts.append(current_count)
    return pd.Series(consecutive_counts, index=df.index, name='consecutive_colors')

class IQOptionTrader:
    def __init__(self, email, password, account_type='PRACTICE'):
        self.email = email
        self.password = password
        self.account_type = account_type
        self.api = None
        self.is_connected = False
        self.is_reconnecting = False
        self.api_lock = threading.Lock()
        self.subscribed_assets = {}

    def resubscribe_all_streams(self):
        """\n        ทำการสมัครรับข้อมูล (Re-subscribe) ของทุก Stream ที่เคยทำงานอยู่\n        """  # inserted
        if not self.subscribed_assets:
            logging.info('ไม่มี Stream ที่ต้องทำการ Re-subscribe')
            return
        logging.info(f'กำลังทำการ Re-subscribe ข้อมูล Candle Stream จำนวน {len(self.subscribed_assets)} รายการ...')
        for asset, timeframe in list(self.subscribed_assets.items()):
            logging.info(f'Re-subscribing to {asset} ({timeframe}s)...')
            self.api.start_candles_stream(asset, timeframe, 100)
        logging.info('Re-subscribe Stream ทั้งหมดสำเร็จ!')

    def connect(self):
        """เชื่อมต่อกับ IQ Option และจัดการการเชื่อมต่อใหม่"""  # inserted
        with self.api_lock:
            if self.is_reconnecting:
                return
            else:  # inserted
                self.is_reconnecting = True
        logging.info('กำลังพยายามเชื่อมต่อ...')
        try:
            if self.api:
                self.api.close()
        except Exception:
            pass  # postinserted
        else:  # inserted
            self.api = IQ_Option(self.email, self.password)
            check, reason = self.api.connect()
            with self.api_lock:
                if check:
                    logging.info('เชื่อมต่อสำเร็จ!')
                    self.is_connected = True
                    logging.info(f'กำลังเปลี่ยนเป็นบัญชี: {self.account_type}')
                    self.api.change_balance(self.account_type)
                    logging.info('กำลังอัปเดตรายการสินทรัพย์ (ACTIVES)...')
                    self.api.update_ACTIVES_OPCODE()
                    logging.info('อัปเดตรายการสินทรัพย์สำเร็จ')
                    self.resubscribe_all_streams()
                    keepalive_thread = threading.Thread(target=self.keepalive)
                    keepalive_thread.daemon = True
                    keepalive_thread.start()
                else:  # inserted
                    logging.error(f'การเชื่อมต่อล้มเหลว: {reason}')
                    self.is_connected = False
                self.is_reconnecting = False
                return self.is_connected
            pass

    def keepalive(self):
        """ส่ง request เป็นระยะเพื่อป้องกันการตัดการเชื่อมต่อ"""  # inserted
        while self.is_connected:
            try:
                if not self.api or not self.api.check_connect():
                    raise ConnectionError('Keepalive check failed: API not connected.')
                self.api.get_server_timestamp()
                time.sleep(30)
            except Exception as e:
                pass  # postinserted
            logging.warning(f'Keepalive ล้มเหลว: {e}. เริ่มกระบวนการเชื่อมต่อใหม่...')
            self.is_connected = False
            self.reconnect()
            return None

    def reconnect(self):
        """จัดการการเชื่อมต่อใหม่เมื่อการเชื่อมต่อหลุด"""  # inserted
        with self.api_lock:
            if self.is_connected or self.is_reconnecting:
                return
        logging.info('การเชื่อมต่อหลุด! กำลังพยายามเชื่อมต่อใหม่ใน 5 วินาที...')
        time.sleep(5)
        self.connect()

    def get_balance(self):
        """ดึงข้อมูลยอดเงินและสกุลเงินปัจจุบัน"""  # inserted
        if not self.is_connected:
            logging.error('ไม่ได้เชื่อมต่อกับ API')
            return (None, None)
        try:
            balance = self.api.get_balance()
            currency = self.api.get_currency()
            return (balance, currency)
        except Exception as e:
            logging.error(f'ไม่สามารถดึงข้อมูล Balance ได้: {e}')
            return (None, None)

    def get_historical_data(self, asset, timeframe, count):
        if not self.is_connected:
            logging.error('ไม่ได้เชื่อมต่อกับ API')
            return pd.DataFrame()
        logging.info(f'กำลังดึงข้อมูลย้อนหลังสำหรับ {asset} timeframe {timeframe}s จำนวน {count} แท่ง...')
        end_time = self.api.get_server_timestamp()
        candles = self.api.get_candles(asset, timeframe, count, end_time)
        if candles:
            df = pd.DataFrame(candles)
            df['from'] = pd.to_datetime(df['from'], unit='s')
            df.set_index('from', inplace=True)
            logging.info('ดึงข้อมูลสำเร็จ')
            return df
        logging.warning('ไม่ได้รับข้อมูลแท่งเทียน')
        return pd.DataFrame()

    def start_realtime_candles(self, asset, timeframe):
        if not self.is_connected:
            logging.error('ไม่ได้เชื่อมต่อกับ API')
            return
        self.subscribed_assets[asset] = timeframe
        logging.info(f'กำลังเริ่ม Real-time candle stream สำหรับ {asset} ({timeframe}s)...')
        self.api.start_candles_stream(asset, timeframe, 100)
        logging.info(f'Stream สำหรับ {asset} เริ่มทำงานแล้ว')

    def stop_realtime_candles(self, asset, timeframe):
        if asset in self.subscribed_assets:
            del self.subscribed_assets[asset]
        try:
            if self.api:
                logging.info(f'กำลังหยุด Real-time candle stream สำหรับ {asset} ({timeframe}s)...')
                self.api.stop_candles_stream(asset, timeframe)
                logging.info(f'Stream สำหรับ {asset} หยุดทำงานแล้ว')
        except Exception as e:
            logging.warning(f'เกิดข้อผิดพลาดขณะพยายามหยุด stream ของ {asset}: {e}')

    def get_realtime_candles_data(self, asset, timeframe):
        """\n        ดึงข้อมูลแท่งเทียนล่าสุดจาก Stream (★★★ แก้ไขให้จัดการ Reconnect ★★★)\n        """  # inserted
        if not self.is_connected:
            return pd.DataFrame()
        candles = None
        try:
            candles = self.api.get_realtime_candles(asset, timeframe)
        except Exception as e:
            pass  # postinserted
        else:  # inserted
            if candles:
                df = pd.DataFrame(list(candles.values()))
                if df.empty:
                    return pd.DataFrame()
                df['from'] = pd.to_datetime(df['from'], unit='s')
                df.set_index('from', inplace=True)
                df.sort_index(inplace=True)
                return df
            return pd.DataFrame()
            error_str = str(e).lower()
            if 'connection' in error_str or 'closed' in error_str or 'socket' in error_str:
                logging.warning(f'[{asset}] ตรวจพบการเชื่อมต่อหลุดขณะดึงข้อมูล: {e}')
                self.is_connected = False
                self.reconnect()
            else:  # inserted
                logging.error(f'[{asset}] เกิดข้อผิดพลาดร้ายแรงขณะดึงข้อมูล: {e}')
            return pd.DataFrame()

def get_open_assets(trader, asset_op, asset_otc, mode='ALL'):
    """\n    asset_op, asset_otc: Dict[str, str]  # key=Asset (ไว้ใช้กับ API), value=Name (ไว้ส่ง firebase)\n    คืนค่า: List[str] ของ asset ที่เปิดให้เทรด (ใช้ key/Asset)\n    """  # inserted
    logging.info('กำลังตรวจสอบสถานะของสินทรัพย์...')
    all_open_assets = trader.api.get_all_open_time()
    if mode.upper() == 'OP':
        assets_to_check = list(asset_op.keys())
    else:  # inserted
        if mode.upper() == 'OTC':
            assets_to_check = list(asset_otc.keys())
        else:  # inserted
            if mode.upper() == 'ALL':
                assets_to_check = sorted(list(set(asset_op.keys()) | set(asset_otc.keys())))
            else:  # inserted
                logging.error(f'โหมดการสแกนไม่ถูกต้อง: {mode}')
                return []
    open_assets_list = []
    for asset_name in assets_to_check:
        try:
            is_binary_open = all_open_assets.get('binary', {}).get(asset_name, {}).get('open', False)
            is_turbo_open = all_open_assets.get('turbo', {}).get(asset_name, {}).get('open', False)
            if is_binary_open or is_turbo_open:
                open_assets_list.append(asset_name)
        except Exception as e:
            pass  # postinserted
    else:  # inserted
        if open_assets_list:
            logging.info(f'พบสินทรัพย์ที่เปิดให้เทรดจำนวน {len(open_assets_list)} รายการ')
        return open_assets_list
        logging.error(f'เกิดข้อผิดพลาดในการตรวจสอบ {asset_name}: {e}')

def wait_for_candle_start(timeframe_seconds):
    """\n    รอจนกว่าจะถึงเวลาเริ่มต้นของแท่งเทียนถัดไป\n    """  # inserted
    timeframe_minutes = timeframe_seconds // 60
    logging.info(f'กำลังซิงโครไนซ์เวลา... จะเริ่มวิเคราะห์ที่จุดเริ่มต้นของแท่งเทียน {timeframe_minutes} นาทีถัดไป')
    while True:
        now = datetime.now()
        is_second_zero = now.second == 0
        is_minute_aligned = now.minute % timeframe_minutes == 0
        if is_second_zero and is_minute_aligned:
            logging.info(f"เวลาตรง! {now.strftime('%H:%M:%S')}. เริ่มการวิเคราะห์...")
            break
        next_minute_aligned = (now.minute // timeframe_minutes + 1) * timeframe_minutes
        if next_minute_aligned >= 60:
            next_minute_aligned = 0
            target_time = now.replace(hour=now.hour + 1, minute=next_minute_aligned, second=0, microsecond=0)
        else:  # inserted
            target_time = now.replace(minute=next_minute_aligned, second=0, microsecond=0)
        remaining = target_time - now
        print(f'\rรออีก {int(remaining.total_seconds())} วินาทีเพื่อเริ่มแท่งเทียนถัดไป...', end='')
        time.sleep(1)
    print('\n')

def analyze_single_asset(trader, asset, timeframe, candle_count, signals_sent_for_candle, lock, db_client, scan_mode, asset_name_map):
    """\n    ฟังก์ชันวิเคราะห์ (ไม่มีการเปลี่ยนแปลง) - วิเคราะห์ Live Candle และส่งครั้งเดียวต่อแท่ง\n    """  # inserted
    try:
        candles_df = trader.get_realtime_candles_data(asset, timeframe)
        if candles_df.empty:
            return
        current_live_candle = candles_df.iloc[(-1)]
        current_candle_timestamp = current_live_candle.name
        analysis_df = candles_df.tail(candle_count)
        sr_df = support_and_resistance(analysis_df, box_period=25)
        donchian_df = donchian_channel(analysis_df, period=20)
        bb_df = bollinger_bands(analysis_df, period=14, std_dev=2)
        stoch_df = stochastic_oscillator(analysis_df, k_period=13, smooth_period=3, d_period=3)
        consecutive_df = consecutive_candle_colors(analysis_df)
        rsi_series = relative_strength_index(analysis_df, period=14)
        results_df = pd.concat([analysis_df, sr_df, donchian_df, bb_df, stoch_df, rsi_series, consecutive_df], axis=1)
        if len(results_df) < 20:
            return
    except Exception as e:
        pass  # postinserted
    else:  # inserted
        results_df['prev_upper_dc'] = results_df['upper_dc'].shift(1)
        results_df['prev_lower_dc'] = results_df['lower_dc'].shift(1)
        last = results_df.iloc[(-1)]
        mid_sr_put = (last['resistance'] + last['support']) / 2
        upper_zone_height = last['resistance'] - mid_sr_put
        is_near_resistance = False
        if upper_zone_height > 0 and (last['max'] - mid_sr_put) / upper_zone_height >= 0.9:
            is_near_resistance = True
        prev_upper_dc_valid = not np.isnan(last['prev_upper_dc'])
        put_conditions_met = is_near_resistance and prev_upper_dc_valid and (last['max'] > last['prev_upper_dc']) and (last['max'] > last['upper_bb']) and (last['%K'] > 80) and (last['consecutive_colors'] >= 3)
        mid_sr_call = (last['resistance'] + last['support']) / 2
        lower_zone_height = mid_sr_call - last['support']
        is_near_support = False
        if lower_zone_height > 0 and (mid_sr_call - last['min']) / lower_zone_height >= 0.9:
            is_near_support = True
        prev_lower_dc_valid = not np.isnan(last['prev_lower_dc'])
        call_conditions_met = is_near_support and prev_lower_dc_valid and (last['min'] < last['prev_lower_dc']) and (last['min'] < last['lower_bb']) and (last['%K'] < 20) and (last['consecutive_colors'] <= (-3))
        message_to_send = None
        display_name = asset_name_map.get(asset, asset)
        if put_conditions_met:
            message_to_send = f'{display_name} | Sell 🔻 [Resistance zone]'
        else:  # inserted
            if call_conditions_met:
                message_to_send = f'{display_name} | Buy 🔺 [Support zone]'
        if message_to_send:
            with lock:
                last_sent_timestamp = signals_sent_for_candle.get(asset)
                if last_sent_timestamp == current_candle_timestamp:
                    return
                else:  # inserted
                    signals_sent_for_candle[asset] = current_candle_timestamp
                    if 'Sell' in message_to_send:
                        logging.info(f"[{asset}] SIGNAL: 🔻 SELL @ {datetime.now().strftime('%H:%M:%S')}")
                    else:  # inserted
                        logging.info(f"[{asset}] SIGNAL: 🔺 BUY @ {datetime.now().strftime('%H:%M:%S')}")
                    collection_name = None
                    if timeframe == 60:
                        collection_name = 'Signal1MOtc' if scan_mode == 'OTC' else 'Signal1M'
                    else:  # inserted
                        if timeframe == 300:
                            collection_name = 'Signal5MOtc' if scan_mode == 'OTC' else 'Signal5M'
                    if collection_name:
                        payload = {'created': firestore.SERVER_TIMESTAMP, 'message': message_to_send}
                        send_signal_to_firestore(db_client, collection_name, payload)
                    else:  # inserted
                        logging.warning(f'ไม่พบ Collection สำหรับโหมด {scan_mode} และ TF {timeframe}')
            if 'NaN' not in str(e) and 'invalid value' not in str(e):
                logging.error(f'[{asset}] เกิดข้อผิดพลาดระหว่างการวิเคราะห์: {e}', exc_info=True)

def send_signal_to_firestore(db_client, collection_name, data_to_send):
    if db_client is None:
        return
    try:
        local_time = datetime.now()
        doc_id = str(int(local_time.timestamp() * 1000))
        db_client.collection(collection_name).document(doc_id).set(data_to_send)
        asset_name_in_msg = data_to_send.get('message').split('|')[0].strip()
        logging.info(f'[{asset_name_in_msg}] ส่งข้อมูลไป Firestore สำเร็จ (ID: {doc_id})')
    except Exception as e:
        logging.error(f'[Firestore] เกิดข้อผิดพลาดในการส่งข้อมูล: {e}')
        return
if __name__ == '__main__':
    expiration_date = datetime(2025, 8, 31)
    if datetime.now() > expiration_date:
        sys.exit()
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    try:
        cert_path = resource_path('krugongsignalotc-firebase-adminsdk-fbsvc-0ab20ee63c.json')
        cred = credentials.Certificate(cert_path)
        firebase_admin.initialize_app(cred)
        db_client = firestore.client()
        logging.info('เชื่อมต่อ Firestore สำเร็จ!')
    except Exception as e:
        pass  # postinserted
    else:  # inserted
        USER_EMAIL = 'testiqapi5m@gmail.com'
        USER_PASSWORD = '123qweqwe'
        ACCOUNT_TYPE = 'PRACTICE'
        SCAN_MODE = 'OTC'
        TIMEFRAME = 300
        CANDLE_COUNT = 100
        REFRESH_ASSETS_INTERVAL = 60
        asset_otc, asset_op, asset_name_map = load_asset_maps_from_excel('Asset.xlsx')
        trader = IQOptionTrader(email=USER_EMAIL, password=USER_PASSWORD, account_type=ACCOUNT_TYPE)
        if not trader.connect():
            exit()
    balance, currency = trader.get_balance()
    if balance is not None:
        logging.info(f'ยอดเงินเริ่มต้น: {balance:.2f} {currency}')
    ASSETS = get_open_assets(trader, asset_op, asset_otc, mode=SCAN_MODE)
    if not ASSETS:
        logging.warning('ไม่พบสินทรัพย์ที่เปิดให้เทรดในขณะนี้ โปรแกรมจะปิดตัวลง')
        exit()
    logging.info(f'สินทรัพย์ที่จะทำการวิเคราะห์: {ASSETS}\n')
    for asset in ASSETS:
        trader.start_realtime_candles(asset, TIMEFRAME)
    wait_for_candle_start(TIMEFRAME)
    signals_sent_for_candle = {}
    last_refresh_minute = (-1)
    shared_lock = threading.Lock()
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(len(ASSETS), (os.cpu_count() or 4) * 2)) as executor:
            pass  # postinserted
    except KeyboardInterrupt:
            while True:
                now = datetime.now()
                if REFRESH_ASSETS_INTERVAL > 0 and now.minute % REFRESH_ASSETS_INTERVAL == 0 and (now.minute!= last_refresh_minute):
                    logging.info(f"ถึงเวลารีเฟรชรายการสินทรัพย์ ({now.strftime('%H:%M')})...")
                    last_refresh_minute = now.minute
                if not trader.is_connected:
                    logging.info('กำลังรอการเชื่อมต่อใหม่...')
                    time.sleep(5)
                    continue
                futs = {executor.submit(analyze_single_asset, trader, asset, TIMEFRAME, CANDLE_COUNT, signals_sent_for_candle, shared_lock, db_client, SCAN_MODE, asset_name_map): asset for asset in ASSETS}
                for fut in as_completed(futs):
                    asset = futs[fut]
                    try:
                        fut.result(timeout=20)
    except Exception as e:
                else:  # inserted
                    time.sleep(5)
        logging.error(f'ไม่สามารถเชื่อมต่อ Firestore ได้: {e}')
        db_client = None
        logging.exception(f'[{asset}] analyze_single_asset error: {e}')
        logging.info('กำลังออกจากโปรแกรม...')
