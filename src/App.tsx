// import { Link, Route, Switch } from 'react-router-dom';
// import Home from './components/Home';
// import Converter from './components/Converter';
import { useState } from 'react';
import './App.css'
import Select from './components/Select';
import { QueryClient, QueryClientProvider } from 'react-query'
import QueryComponent from './components/QueryComponent'

const options = [
  { label: "first", value: 1 },
  { label: "second", value: 2 },
  { label: "third", value: 3 },
  { label: "fourth", value: 4 },
  { label: "fifth", value: 5 },
]

const queryClient = new QueryClient()

function App() {

  const [value, setValue] = useState<{ label: string; value: string | number } | undefined>(options[0])
  const [multipleValue, setMultipleValue] = useState<{ label: string; value: string | number }[]>([options[0]])
  // { label: string; value: string |number }

  return (
    // <div className="App">
    //   <nav>
    //     <div className="menu">
    //       <Link to="/">Home</Link>
    //       <Link to="/converter">Converter</Link>
    //     </div>
    //   </nav>
    //   <Switch>
    //     <Route exact path="/" component={Home} />
    //     <Route path="/converter" component={Converter} />
    //   </Switch>
    // </div>
    <div>
      <QueryClientProvider client={queryClient}>
        <QueryComponent />
      </QueryClientProvider>

      <Select
        multiple={true}
        options={options}
        value={multipleValue}
        onChange={opt => { setMultipleValue(opt) }}
      />
      <br />
      <Select
        multiple={false}
        options={options}
        value={value}
        onChange={opt => { setValue(opt) }}
      />
    </div>
  )
}

export default App
