import { User } from "@/types/user";
import { useTranslations } from "next-intl";

type SubscriptExpireProps = {
  user?: User;
};

export default function SubscriptExpire({ user }: SubscriptExpireProps) {
  const t = useTranslations();

  if (!user) return null;

  // Calculate days until expiration
  const expiredAt = new Date(user.expiredAt);
  const now = new Date();
  const diffTime = expiredAt.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine styling based on days remaining
  const isExpiringSoon = diffDays <= 7;
  const isExpired = diffDays <= 0;

  const getStatusColor = () => {
    if (isExpired) return "text-red-500 bg-red-50 border-red-200";
    if (isExpiringSoon) return "text-orange-500 bg-orange-50 border-orange-200";
    return "text-green-900 bg-green-50 border-green-200";
  };

  const getStatusText = () => {
    if (isExpired) return t("subscription.expired");
    if (isExpiringSoon)
      return t("subscription.expiringSoon", { days: diffDays });
    return t("subscription.active");
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor()}`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isExpired
              ? "bg-red-500"
              : isExpiringSoon
              ? "bg-orange-500"
              : "bg-green-500"
          }`}
        />
        <span className="font-medium">{getStatusText()}</span>
        <span className="text-xs opacity-75 font-medium">
          {expiredAt.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
