import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    }
    document.body.appendChild(script);
  })}

function App() {
  const displayRazorpay = async () => {
    const res=await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if(!res){
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }
    const responseObj= await fetch('http://localhost:3000/checkout', { method: 'POST' })
    const paymentResponse=await responseObj.json();
    console.log(paymentResponse);
  }
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React Payments</h1>
      <a onClick={displayRazorpay} target='_blank'>make payment</a>
    </>
  )
}

export default App
