import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

/**
 * Composant réutilisable pour afficher un avatar utilisateur
 * - Affiche l'image de profil si disponible
 * - Sinon affiche les initiales du nom et prénom
 * @param {Object} user - L'utilisateur avec avatar, nom, prenom
 * @param {string} size - Taille de l'avatar : "sm" (h-8 w-8), "md" (h-10 w-10), "lg" (h-16 w-16)
 * @param {string} className - Classes Tailwind additionnelles
 */
export default function UserAvatar({ user, size = "md", className = "" }) {
  if (!user) return null;

  // Map des tailles
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  const avatarSize = sizeClasses[size] || sizeClasses.md;

  // Générer les initiales
  const getInitials = () => {
    const nom = user.nom || "";
    const prenom = user.prenom || "";
    const combined = `${nom} ${prenom}`.trim();
    return combined
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Générer une couleur de fond basée sur les initiales
  const getInitialsBgColor = () => {
    const initials = getInitials();
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    const code = initials
      .charCodeAt(0) + (initials.charCodeAt(1) || 0);
    return colors[code % colors.length];
  };

  return (
    <Avatar className={`${avatarSize} ${className}`}>
      {user.avatar && user.avatar.trim() && (
        <AvatarImage
          src={user.avatar}
          alt={`${user.nom} ${user.prenom}`}
        />
      )}
      <AvatarFallback className={`${getInitialsBgColor()} text-white font-semibold`}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
