import './App.css';
import { Outlet } from 'react-router-dom';
import { Navbar } from './component/navbar/Navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux/rootReducer';

// Create a client
const queryClient = new QueryClient();

const store = createStore(rootReducer);
export type RootState = ReturnType<typeof rootReducer>;

function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <div className='main'>
                    <Navbar />
                    <div style={{ marginTop: '5rem' }}>
                        <Outlet />
                    </div>
                </div>
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
