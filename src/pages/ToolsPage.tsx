import { useParams, Navigate } from 'react-router-dom';
import { InfluenceMap } from '../components/features/influence-mapping/InfluenceMap';

export function ToolsPage() {
  const { tool } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(() => {
          switch (tool) {
            case 'influence-mapping':
              return (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-gray-900">Influence Map</h1>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-12rem)]">
                    <InfluenceMap />
                  </div>
                </div>
              );
            default:
              return <Navigate to="/" replace />;
          }
        })()}
      </div>
    </div>
  );
}
