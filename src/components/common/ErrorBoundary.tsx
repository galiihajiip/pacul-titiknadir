"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-[12px] border border-red-100 bg-red-50 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-700">Terjadi Kesalahan</p>
            {this.state.message && (
              <p className="mt-1 text-xs text-red-500">{this.state.message}</p>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="rounded-md bg-red-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-600"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
