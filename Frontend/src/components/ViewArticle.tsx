import React from 'react'
import { IArticle } from '../types/articleTypes';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import RenderContent from './RenderContent';


export interface ViewArticleProps {
    isOpen: boolean;
    onOpenChange: () => void;
    content: IArticle
}

const ViewArticle: React.FC<ViewArticleProps> = ({ isOpen, onOpenChange, content }) => {

    return (
        <Modal isOpen={isOpen} backdrop='opaque' size='5xl' scrollBehavior='inside' onOpenChange={onOpenChange}
            classNames={{
                backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 mt-4 text-3xl">{content.title}</ModalHeader>
                        <ModalBody>
                            <p>
                                <RenderContent
                                    content={content?.content}
                                    className='mt-2'
                                />
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ViewArticle
