import React from "react";


interface ContentNode {
    type: string;
    content?: ContentNode[];
    attrs?: {
        level?: number;
        src?: string;
    };
    marks?: { type: string }[];
    text?: string;
}

interface RenderContentProps {
    content: string;
    className?: string;
}

const RenderContent: React.FC<RenderContentProps> = ({ content, className = '' }) => {
    const parseContent = (jsonContent: string) => {
        try {
            return JSON.parse(jsonContent);
        } catch (error) {
            console.error('Error parsing content:', error);
            return { content: [] };
        }
    };

    const renderNode = (node: ContentNode): React.ReactNode => {
        switch (node.type) {
            case 'heading': {
                const HeadingTag = `h${node.attrs?.level || 2}` as keyof JSX.IntrinsicElements;
                return (
                    <HeadingTag className="mb-4 font-bold text-gray-900">
                        {node.content?.map((child) => renderNode(child))}
                    </HeadingTag>
                );
            }
    
            case 'paragraph':
                return (
                    <p className="mb-4 text-gray-600">
                        {node.content?.map((child) => renderNode(child))}
                    </p>
                );
    
            case 'text': {
                const textContent = node.text || '';
                if (node.marks?.some(mark => mark.type === 'bold')) {
                    return <strong className="font-semibold">{textContent}</strong>;
                }
                if (node.marks?.some(mark => mark.type === 'code')) {
                    return <code className="p-1 bg-gray-100 rounded">{textContent}</code>;
                }
                return textContent;
            }
    
            case 'hardBreak':
                return <br />;
    
            case 'bulletList':
                return (
                    <ul className="ml-4 list-disc ">
                        {node.content?.map((listItem, index) => (
                            <React.Fragment key={index}>
                                {renderNode(listItem)}
                            </React.Fragment>
                        ))}
                    </ul>
                );
    
            case 'orderedList':
                return (
                    <ol className="ml-4 list-decimal ">
                        {node.content?.map((listItem, index) => (
                            <React.Fragment key={index}>
                                {renderNode(listItem)}
                            </React.Fragment>
                        ))}
                    </ol>
                );
    
            case 'listItem':
                return (
                    <li className="mb-2">
                        <span className="flex-1">
                            {node.content?.map((child, index) => (
                                <React.Fragment key={index}>
                                    {renderNode(child)}
                                </React.Fragment>
                            ))}
                        </span>
                    </li>
                );
    
            case 'image':
                return (
                    <div className="my-4">
                        <img
                            src={node.attrs?.src}
                            alt="Article content"
                            className="h-auto max-w-full rounded-lg"
                        />
                    </div>
                );
    
            default:
                return null;
        }
    };

    const parsedContent = parseContent(content);

    return (
        <div className={`prose max-w-none ${className}`}>
            {parsedContent.content?.map((node: ContentNode, index: number) => (
                <React.Fragment key={index}>
                    {renderNode(node)}
                </React.Fragment>
            ))}
        </div>
    );
};

export default RenderContent;