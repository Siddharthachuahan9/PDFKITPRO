import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getToolBySlug, TOOLS } from '@/lib/tools';
import MergeTool from './merge-tool';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.name,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | PDFKit Pro`,
      description: tool.description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // For now, only merge tool is fully implemented
  // Other tools will show a coming soon message
  if (tool.slug === 'merge') {
    return <MergeTool tool={tool} />;
  }

  // Placeholder for other tools
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-privacy-teal/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-dark mb-2">{tool.name}</h1>
        <p className="text-gray-500 mb-4">{tool.description}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
          Coming Soon
        </div>
      </div>
    </div>
  );
}
