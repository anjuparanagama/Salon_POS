export type UserProfile = {
  name: string;
  role?: string;
  avatarUrl?: string;
  initials?: string;
  isOnline?: boolean;
};

export type UserProfileDropdownProps = {
  user?: UserProfile;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
};

