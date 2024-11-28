"use client";

import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Capture des erreurs au niveau des composants
    console.error("Erreur capturée dans ErrorBoundary :", { error, errorInfo });
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  static getDerivedStateFromError(error: Error) {
    // Mettre à jour l'état pour afficher l'interface d'erreur
    return { hasError: true, error };
  }

  componentDidMount() {
    // Gestion des erreurs globales
    if (typeof window !== "undefined") {
      window.onerror = (message, source, lineno, colno, error) => {
        console.error("Erreur globale capturée :", {
          message,
          source,
          lineno,
          colno,
          error,
        });
      };

      window.onunhandledrejection = (event) => {
        console.error("Rejet de promesse non géré :", event.reason);
      };
    }
  }

  render() {
    if (this.state.hasError) {
      // Rendu d'une interface alternative en cas d'erreur
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Une erreur s&apos;est produite</h2>
          <p>
            Veuillez réessayer plus tard. Si le problème persiste, contactez le
            support.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
