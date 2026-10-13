import { useNavigate } from "react-router-dom";
import {
  FlaskConical,
  GitCompareArrows,
  TestTube,
  ArrowRight,
} from "lucide-react";
import { Card } from "../ui";

const quickActions = [
  {
    to: "/evaluations",
    icon: FlaskConical,
    title: "New Evaluation",
    description: "Test model responses with custom prompts",
    gradient: "from-indigo-500 to-indigo-600",
    shadow: "shadow-indigo-200",
  },
  {
    to: "/comparison",
    icon: GitCompareArrows,
    title: "Compare Models",
    description: "Side-by-side model comparison",
    gradient: "from-purple-500 to-purple-600",
    shadow: "shadow-purple-200",
  },
  {
    to: "/test-cases",
    icon: TestTube,
    title: "Test Suite",
    description: "Manage your evaluation test cases",
    gradient: "from-violet-500 to-violet-600",
    shadow: "shadow-violet-200",
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Card
            key={action.to}
            hover
            className="cursor-pointer group"
            padding="md"
          >
            <div onClick={() => navigate(action.to)} className="space-y-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} shadow-md ${action.shadow} flex items-center justify-center`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {action.title}
                  </h4>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {action.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
