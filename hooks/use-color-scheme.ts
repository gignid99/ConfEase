import { useColorScheme as systemUseColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Mode = 'dark' | 'light';

let preferred: Mode | null = null;
const subscribers: Array<() => void> = [];

export const setPreferredColorScheme = async (mode: Mode | null) => {
	preferred = mode;
	try {
		if (mode === 'dark') await AsyncStorage.setItem('settings.darkMode', '1');
		else if (mode === 'light') await AsyncStorage.setItem('settings.darkMode', '0');
		else await AsyncStorage.removeItem('settings.darkMode');
	} catch (e) {
		console.warn('Failed to persist color scheme', e);
	}
	console.log('[use-color-scheme] setPreferredColorScheme ->', mode);
	subscribers.forEach((cb) => cb());
};

export function useColorScheme(): Mode {
	const system = systemUseColorScheme();
	const [mode, setMode] = useState<Mode>(() => {
		if (preferred) return preferred;
		return system === 'dark' ? 'dark' : 'light';
	});

	useEffect(() => {
		let mounted = true;

		const applyStored = async () => {
			try {
				const stored = await AsyncStorage.getItem('settings.darkMode');
				if (!mounted) return;
				if (stored === '1') {
					preferred = 'dark';
					setMode('dark');
				} else if (stored === '0') {
					preferred = 'light';
					setMode('light');
				} else {
					preferred = null;
					setMode(system === 'dark' ? 'dark' : 'light');
				}
			} catch (e) {
				// ignore
			}
		};

		const cb = () => {
			if (!mounted) return;
			setMode(preferred ?? (system === 'dark' ? 'dark' : 'light'));
		};

		subscribers.push(cb);
		applyStored();

		return () => {
			mounted = false;
			const idx = subscribers.indexOf(cb);
			if (idx >= 0) subscribers.splice(idx, 1);
		};
	}, [system]);

	return mode;
}
