
import { Flex } from 'antd';
import './App.css'
import FancyForm from './page/Fancy-form/fancyForm';

function App() {
  

  return (
    <div className="background-container h-screen">
      <Flex vertical align="center" justify="center" className="h-full">
        <FancyForm />
      </Flex>
    </div>
  )
}

export default App
