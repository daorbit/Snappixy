import styled from "@emotion/styled";
import { Dialog, Paper, Box, Button, IconButton } from "@mui/material";
import type { Theme } from "@mui/material/styles";

export const StyledDialog = styled(Dialog)<{ theme: Theme }>`
  & .MuiDialog-paper {
    border-radius: 24px;
    max-width: 1200px;
    width: 95vw;
    height: 90vh;
    max-height: 90vh;
    background: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`
        : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`};
    box-shadow: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? "0 25px 50px rgba(0, 0, 0, 0.5)"
        : "0 25px 50px rgba(0, 0, 0, 0.25)"};
    backdrop-filter: blur(10px);
    z-index: 1300;

    /* Responsive design */
    @media (max-width: 768px) {
      width: 98vw;
      height: 95vh;
      max-height: 95vh;
      border-radius: 16px;
    }
  }
`;

export const DialogHeader = styled(Box)<{ theme: Theme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.grey[100]};
  color: ${({ theme }) => theme.palette.text.primary};
  border-radius: 24px 24px 0 0;
`;

export const HeaderTitle = styled(Box)<{ theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 16px;
  & .MuiTypography-root {
    font-weight: 600;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const ContentContainer = styled(Box)<{ theme: Theme }>`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: ${({ theme }) => theme.palette.background.default};
`;

export const PresetsSection = styled(Box)<{ theme: Theme }>`
  & .MuiTypography-root {
    font-weight: 600;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const PresetsContainer = styled(Box)<{ theme: Theme }>`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 16px 8px 0;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.palette.divider} transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.palette.divider};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.palette.text.secondary};
  }

  & .MuiChip-root {
    border-radius: 16px;
    padding: 8px 12px;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    background: ${({ theme }) => theme.palette.background.paper};
    color: ${({ theme }) => theme.palette.text.primary};
    border: 1px solid ${({ theme }) => theme.palette.divider};
    flex-shrink: 0;
    white-space: nowrap;
    min-width: fit-content;
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) =>
        theme.palette.mode === "dark"
          ? "0 4px 8px rgba(0, 0, 0, 0.3)"
          : "0 4px 8px rgba(0, 0, 0, 0.15)"};
      background: ${({ theme }) => theme.palette.action.hover};
    }
  }

  /* Active chip styling with custom border color */
  & .MuiChip-filled.MuiChip-colorPrimary {
    border: 2px solid ${({ theme }) => theme.palette.primary.main};
    background: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
        : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`};
    color: ${({ theme }) => theme.palette.primary.contrastText};
    box-shadow: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(0, 0, 0, 0.4)"
        : "0 4px 12px rgba(0, 0, 0, 0.2)"};
    font-weight: 600;
    transform: translateY(-1px);

    &:hover {
      transform: translateY(-3px);
      box-shadow: ${({ theme }) =>
        theme.palette.mode === "dark"
          ? "0 6px 16px rgba(0, 0, 0, 0.5)"
          : "0 6px 16px rgba(0, 0, 0, 0.3)"};
      border-color: ${({ theme }) => theme.palette.primary.light};
    }
  }

  /* Ensure chips don't wrap and stay in a single row */
  flex-wrap: nowrap;
  width: 100%;

  /* Add a subtle gradient to indicate scrollability */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 20px;
    background: linear-gradient(
      to left,
      ${({ theme }) => theme.palette.background.default},
      transparent
    );
    pointer-events: none;
  }
`;

export const MainContent = styled(Box)`
  display: flex;
  gap: 12px;
  flex: 1;
  overflow: hidden;

  /* Responsive layout */
  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 16px;
    overflow: visible;
  }
`;

export const ControlsPanel = styled(Paper)<{ theme: Theme }>`
  flex: 1;
  padding: 24px;
  border-radius: 16px;
  background: ${({ theme }) => theme.palette.background.paper};
  box-shadow: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
      : "0 4px 12px rgba(0, 0, 0, 0.1)"};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Responsive adjustments */
  @media (max-width: 1200px) {
    flex: none;
    height: auto;
    max-height: 400px;
    padding: 16px;
  }
`;

export const TabsContainer = styled(Box)<{ theme: Theme }>`
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  & .MuiTabs-root {
    min-height: 48px;
    & .MuiTab-root {
      min-height: 48px;
      text-transform: none;
      font-weight: 500;
      font-size: 0.9rem;
      border-radius: 8px;
      margin: 0 4px;
      color: ${({ theme }) => theme.palette.text.secondary};
      &.Mui-selected {
        background-color: ${({ theme }) => theme.palette.primary.main};
        color: ${({ theme }) => theme.palette.primary.contrastText};
      }
    }
  }
`;

export const TabContent = styled(Box)<{ theme: Theme }>`
  flex: 1;
  overflow: auto;
  padding: 16px 0;
  & .MuiFormControl-root {
    margin-bottom: 16px;
    & .MuiInputLabel-root {
      font-weight: 500;
      color: ${({ theme }) => theme.palette.text.secondary};
    }
    & .MuiOutlinedInput-root {
      border-radius: 12px;
      background: ${({ theme }) => theme.palette.background.paper};
      & fieldset {
        border-color: ${({ theme }) => theme.palette.divider};
      }
      &:hover fieldset {
        border-color: ${({ theme }) => theme.palette.primary.main};
      }
    }
  }
  & .MuiTextField-root {
    & .MuiOutlinedInput-root {
      border-radius: 12px;
      background: ${({ theme }) => theme.palette.background.paper};
    }
  }
`;

export const PreviewPanel = styled(Paper)<{ theme: Theme }>`
  flex: 1;
  padding: 12px;
  border-radius: 0px;
  background: #000;
  box-shadow: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
      : "0 4px 12px rgba(0, 0, 0, 0.1)"};
  display: flex;
  flex-direction: column;

  /* Responsive adjustments */
  @media (max-width: 1200px) {
    flex: none;
    height: 400px;
    padding: 16px;
  }
`;

export const PreviewHeader = styled(Box)<{ theme: Theme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  & .MuiTypography-root {
    font-weight: 600;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const PreviewImage = styled("img")<{ theme: Theme }>`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center center;
  box-shadow: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "0 4px 12px rgba(0, 0, 0, 0.4)"
      : "0 4px 12px rgba(0, 0, 0, 0.15)"};
  transition: all 0.3s ease-in-out;
  border-radius: 8px;
  display: block;

  /* Ensure proper fitting within aspect ratio container */
  @media (orientation: portrait) {
    object-position: center center;
  }

  @media (orientation: landscape) {
    object-position: center center;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    object-fit: contain;
    border-radius: 4px;
    object-position: center center;
  }

  /* Smooth loading animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  animation: fadeIn 0.3s ease-out;
`;

export const TransformationsInfo = styled(Box)<{ theme: Theme }>`
  margin-top: 16px;
  padding: 16px;
  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[100]};
  border-radius: 8px;
  & .MuiTypography-root {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.palette.text.secondary};
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  }
`;

export const DialogFooter = styled(Box)<{ theme: Theme }>`
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.palette.divider};
  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.grey[50]};
  border-radius: 0 0 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

export const StyledButton = styled(Button)<{ theme: Theme }>`
  border-radius: 16px;
  padding: 8px 24px;
  text-transform: none;
  font-weight: 500;
  box-shadow: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? "0 2px 8px rgba(0, 0, 0, 0.3)"
      : "0 2px 8px rgba(0, 0, 0, 0.1)"};
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(0, 0, 0, 0.4)"
        : "0 4px 12px rgba(0, 0, 0, 0.15)"};
  }
`;

export const PrimaryButton = styled(StyledButton)<{ theme: Theme }>`
  background: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  &:hover {
    background: ${({ theme }) => theme.palette.primary.dark};
  }
`;

export const SecondaryButton = styled(StyledButton)<{ theme: Theme }>`
  background: ${({ theme }) =>
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[200]};
  color: ${({ theme }) => theme.palette.text.primary};
  &:hover {
    background: ${({ theme }) =>
      theme.palette.mode === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[300]};
  }
`;

export const StyledIconButton = styled(IconButton)<{ theme: Theme }>`
  border-radius: 12px;
  padding: 8px;
  transition: all 0.2s ease-in-out;
  color: ${({ theme }) => theme.palette.text.secondary};
  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
    transform: scale(1.1);
  }
`;

export const LoadingPlaceholder = styled(Box)<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: ${({ theme }) => theme.palette.text.secondary};
  & .MuiTypography-root {
    font-size: 1.1rem;
    font-weight: 500;
  }
`;
