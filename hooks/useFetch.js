import { useEffect, useState } from 'react';

export function useFetch( fetchFn, body, defaultValue, dependencies, onFinish ) {

    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState();
    const [fetchedData, setFetchedData] = useState( defaultValue );

    useEffect(() => {
        
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchData() {
          setIsFetching(true);
          try {
            const data = await fetchFn( body, { signal } );
            setFetchedData(data);
            try{ onFinish(data) }catch(e){}
          } catch (error) {
            if ( !controller.signal.aborted ) {
              setError({ message: error.message || 'Failed to fetch data.' });
            }
          }
    
          setIsFetching(false);
        }

        fetchData();

        return () => controller.abort();
      }, [fetchFn, body, ...dependencies]);

    return {
        isFetching,
        error,
        fetchedData,
        setFetchedData
    }

}