import { MmrBracket } from './mmr-bracket';

export const MMR_BRACKETS: MmrBracket[] = [
    {threshold: 1149, name: 'amateur',      label: 'Amateur'},
    {threshold: 1299, name: 'semi-pro',     label: 'Semi-Pro'},
    {threshold: 1499, name: 'professional', label: 'Professional'},
    {threshold: 1699, name: 'world-class',  label: 'World Class'},
    {threshold: 9999, name: 'legendary',    label: 'Legendary'}
];