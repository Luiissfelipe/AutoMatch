import { useEffect, useState } from 'react';

export function useCarFeed({ fetcher, selectData, errorMessage }) {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadCars = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetcher();
        const list = selectData ? selectData(response) : response || [];

        if (isMounted) {
          setCars(Array.isArray(list) ? list : []);
        }
      } catch (error) {
        console.error(errorMessage, error);

        if (isMounted) {
          setCars([]);
          setError(error.message || errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCars();

    return () => {
      isMounted = false;
    };
  }, [fetcher, selectData, errorMessage]);

  return { cars, isLoading, error };
}
