
import { EditorView, Decoration, DecorationSet, WidgetType } from '@codemirror/view';
import { StateField, EditorState } from '@codemirror/state';

// Create a placeholder extension for CodeMirror
export const placeholderExtension = (placeholder: string) => {
  // Create a custom widget class for the placeholder
  class PlaceholderWidget extends WidgetType {
    constructor(readonly placeholder: string) {
      super();
    }
    
    toDOM() {
      const span = document.createElement('span');
      span.className = 'cm-placeholder';
      span.textContent = this.placeholder;
      span.setAttribute('aria-label', 'placeholder');
      return span;
    }
    
    eq(other: PlaceholderWidget) {
      return other.placeholder === this.placeholder;
    }
    
    ignoreEvent() {
      return false;
    }
    
    destroy() {
      // No cleanup needed
    }
  }

  // Create a decoration that displays the placeholder text
  const placeholderDecoration = Decoration.widget({
    widget: new PlaceholderWidget(placeholder),
    side: 1
  });

  // Create a state field that will hold our decorations
  const placeholderField = StateField.define<DecorationSet>({
    create(state) {
      return state.doc.length ? Decoration.none : Decoration.set([
        placeholderDecoration.range(0)
      ]);
    },
    update(decorations, tr) {
      if (!tr.docChanged) return decorations;
      return tr.newDoc.length ? Decoration.none : Decoration.set([
        placeholderDecoration.range(0)
      ]);
    },
    provide: field => EditorView.decorations.from(field)
  });

  // Return the extension and add styling for the placeholder
  return [
    placeholderField,
    EditorView.baseTheme({
      '.cm-placeholder': {
        color: 'rgba(128, 128, 128, 0.7)',
        display: 'inline-block',
        fontStyle: 'italic',
        pointerEvents: 'none',
        userSelect: 'none'
      }
    })
  ];
};

// Custom extension to ensure focus is maintained
export const focusExtension = EditorView.domEventHandlers({
  focus(event, view) {
    console.log('Editor focused');
    return false;
  },
  blur(event, view) {
    console.log('Editor blurred');
    return false;
  },
  click(event, view) {
    // Ensure focus is set when clicking anywhere in the editor
    if (document.activeElement !== view.contentDOM) {
      view.focus();
    }
    return false;
  }
});
