import React from "react";
import { useParams } from "react-router-dom";
import EditorContainer from "@/components/editor/EditorContainer";

/**
 * Renders the main editor container.
 * Database and query clients are initialized at the app root.
 * 
 * This component checks if an ID is provided in the URL parameters.
 * If not, it passes a flag to EditorContainer to create a new empty prompt.
 */
const EditorPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // When no ID is provided, we're creating a new prompt
  const isNewPrompt = !id;
  
  return <EditorContainer isNewPrompt={isNewPrompt} />;
};

export default EditorPage;
