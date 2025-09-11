"use client";
import React, {
  useReducer,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { debounce } from "lodash";
import useParams from "@/hooks/useParams";

// Types
interface PriceRange {
  minPrice: number;
  maxPrice: number;
}

interface State {
  priceRange: PriceRange;
  dragging: "min" | "max" | null;
  maxProductPrice: number;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "SET_PRICE_RANGE"; payload: Partial<PriceRange> }
  | { type: "SET_DRAGGING"; payload: "min" | "max" | null }
  | { type: "SET_MAX_PRODUCT_PRICE"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Constants
const MIN_PRICE = 10;
const DEFAULT_MAX_PRICE = 100_000_000;

// Reducer
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PRICE_RANGE":
      return {
        ...state,
        priceRange: {
          minPrice: Math.max(
            MIN_PRICE,
            Math.min(
              action.payload.minPrice ?? state.priceRange.minPrice,
              state.priceRange.maxPrice - 1
            )
          ),
          maxPrice: Math.min(
            state.maxProductPrice,
            Math.max(
              action.payload.maxPrice ?? state.priceRange.maxPrice,
              state.priceRange.minPrice + 1
            )
          ),
        },
      };
    case "SET_DRAGGING":
      return { ...state, dragging: action.payload };
    case "SET_MAX_PRODUCT_PRICE":
      return {
        ...state,
        maxProductPrice: action.payload,
        priceRange: {
          minPrice: state.priceRange.minPrice,
          maxPrice: Math.min(action.payload, state.priceRange.maxPrice),
        },
        error: null,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Mock API to fetch max product price
const fetchMaxProductPrice = async (): Promise<number> => {
  try {
    // Simulating an API call with a delay
    const response = await fetch("/api/products/max-price");
    if (!response.ok) {
      throw new Error("Failed to fetch max price");
    }
    const data = await response.json();
    if (!data?.maxPrice) {
      throw new Error("Invalid data format");
    }
    return data.maxPrice;
  } catch (error) {
    console.error("Error fetching max price:", error);
    throw error;
  }
};

const PriceFilter: React.FC = () => {
  const { setActiveParam, params } = useParams();
  const [state, dispatch] = useReducer(reducer, {
    priceRange: { minPrice: MIN_PRICE, maxPrice: DEFAULT_MAX_PRICE },
    dragging: null,
    maxProductPrice: DEFAULT_MAX_PRICE,
    isLoading: false,
    error: null,
  });
  const trackRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch max product price on mount
  // useEffect(() => {
  //   const loadMaxPrice = async () => {
  //     dispatch({ type: "SET_LOADING", payload: true });
  //     dispatch({ type: "SET_ERROR", payload: null });
  //     try {
  //       const maxPrice = await fetchMaxProductPrice();
  //       dispatch({ type: "SET_MAX_PRODUCT_PRICE", payload: maxPrice });
  //     } catch (error) {
  //       dispatch({
  //         type: "SET_ERROR",
  //         payload: "Failed to load price range. Using default values.",
  //       });
  //     } finally {
  //       dispatch({ type: "SET_LOADING", payload: false });
  //     }
  //   };

  //   loadMaxPrice();
  // }, []);

  // Update URL params after 2 seconds of inactivity
  useEffect(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      setActiveParam({
        ...params,
        minPrice: state.priceRange.minPrice.toString(),
        maxPrice: state.priceRange.maxPrice.toString(),
      });
    }, 2000);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [
    state.priceRange.minPrice,
    state.priceRange.maxPrice,
    setActiveParam,
    params,
  ]);

  // Calculate percentage for slider positioning
  const getLeftPercent = useCallback(
    (value: number) =>
      ((value - MIN_PRICE) / (state.maxProductPrice - MIN_PRICE)) * 100,
    [state.maxProductPrice]
  );

  // Handle slider movement
  const handleMove = useCallback(
    (clientX: number) => {
      if (!state.dragging || !trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const percent = pos / rect.width;
      const value = Math.round(
        MIN_PRICE + percent * (state.maxProductPrice - MIN_PRICE)
      );

      dispatch({
        type: "SET_PRICE_RANGE",
        payload:
          state.dragging === "min" ? { minPrice: value } : { maxPrice: value },
      });
    },
    [state.dragging, state.maxProductPrice]
  );

  // Mouse event handlers
  const handleMouseMove = useCallback(
    (e: MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );
  const handleTouchMove = useCallback(
    (e: TouchEvent) => handleMove(e.touches[0].clientX),
    [handleMove]
  );
  const handleUp = useCallback(
    () => dispatch({ type: "SET_DRAGGING", payload: null }),
    []
  );

  // Event listeners setup
  useEffect(() => {
    if (state.dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchend", handleUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, [state.dragging, handleMouseMove, handleTouchMove, handleUp]);

  // Debounced input handler
  const handleInputChange = useMemo(
    () =>
      debounce((type: "minPrice" | "maxPrice", value: string) => {
        const num = parseInt(value.replace(/\D/g, "")) || MIN_PRICE;
        dispatch({ type: "SET_PRICE_RANGE", payload: { [type]: num } });
      }, 300),
    []
  );

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      handleInputChange.cancel();
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [handleInputChange]);

  if (state.isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <p>Loading price filter...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="font-bold text-lg mb-6 text-gray-800">فیلتر قیمت</h2>

      {state.error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {state.error}
        </div>
      )}

      {/* Input Fields */}
      <div>
        <div className="flex flex-col">
          <label htmlFor="minPrice" className="text-sm text-gray-600 mb-1">
            حداقل:
          </label>
          <input
            id="minPrice"
            type="text"
            value={state.priceRange.minPrice.toLocaleString()}
            onChange={(e) => handleInputChange("minPrice", e.target.value)}
            className="border rounded px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="حداقل قیمت"
            inputMode="numeric"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="maxPrice" className="text-sm text-gray-600 mb-1">
            حداکثر:
          </label>
          <input
            id="maxPrice"
            type="text"
            value={state.priceRange.maxPrice.toLocaleString()}
            onChange={(e) => handleInputChange("maxPrice", e.target.value)}
            className="border rounded px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="حداکثر قیمت"
            inputMode="numeric"
          />
        </div>
      </div>

      {/* Slider */}
      <div ref={trackRef} className="relative w-full h-6 mt-4">
        <div className="absolute w-full h-2 bg-gray-200 top-1/2 -translate-y-1/2 rounded-full" />
        <div
          className="absolute h-2 bg-blue-500 top-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${getLeftPercent(state.priceRange.minPrice)}%`,
            width: `${
              getLeftPercent(state.priceRange.maxPrice) -
              getLeftPercent(state.priceRange.minPrice)
            }%`,
          }}
        />
        <div
          className="absolute w-5 h-5 rounded-full bg-blue-600 cursor-pointer top-1/2 -translate-y-1/2 shadow-md hover:bg-blue-700 transition-colors"
          style={{ left: `${getLeftPercent(state.priceRange.minPrice)}%` }}
          onMouseDown={() => dispatch({ type: "SET_DRAGGING", payload: "min" })}
          onTouchStart={() =>
            dispatch({ type: "SET_DRAGGING", payload: "min" })
          }
          role="slider"
          aria-label="دکمه حداقل قیمت"
          aria-valuemin={MIN_PRICE}
          aria-valuemax={state.priceRange.maxPrice - 1}
          aria-valuenow={state.priceRange.minPrice}
        />
        <div
          className="absolute w-5 h-5 rounded-full bg-blue-600 cursor-pointer top-1/2 -translate-y-1/2 shadow-md hover:bg-blue-700 transition-colors"
          style={{ left: `${getLeftPercent(state.priceRange.maxPrice)}%` }}
          onMouseDown={() => dispatch({ type: "SET_DRAGGING", payload: "max" })}
          onTouchStart={() =>
            dispatch({ type: "SET_DRAGGING", payload: "max" })
          }
          role="slider"
          aria-label="دکمه حداکثر قیمت"
          aria-valuemin={state.priceRange.minPrice + 1}
          aria-valuemax={state.maxProductPrice}
          aria-valuenow={state.priceRange.maxPrice}
        />
      </div>
    </div>
  );
};

export default PriceFilter;
