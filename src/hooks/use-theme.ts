// hooks/use-theme.ts
import {useState, useEffect} from 'react';
import {useTheme as useNextTheme} from 'next-themes';

export function useTheme() {
  const {setTheme, theme} = useNextTheme();

  return {
    theme,
    setTheme,
  };
}
