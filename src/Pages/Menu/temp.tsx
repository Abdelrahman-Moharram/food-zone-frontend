import React from 'react';
import Button from '../../Components/ui/Common/Button';

const TempMenu = () => {
  // Sample data for the menu
  const menuItems = [
    { id: 1, name: 'Espresso', price: '$3.50', desc: 'Rich and bold single shot.' },
    { id: 2, name: 'Cappuccino', price: '$4.50', desc: 'Espresso with steamed milk foam.' },
    { id: 3, name: 'Latte', price: '$4.75', desc: 'Creamy milk with a shot of espresso.' },
    { id: 4, name: 'Croissant', price: '$3.00', desc: 'Buttery, flaky, and fresh.' },
    { id: 5, name: 'Bagel', price: '$2.50', desc: 'Toasted with cream cheese.' },
    { id: 6, name: 'Muffin', price: '$3.25', desc: 'Blueberry or Chocolate chip.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Main Grid Container: 3 Columns Total */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        
        {/* LEFT SIDE: The Content (Takes up 2 parts) */}
        <div className="md:col-span-2">
          <div className="bg-container rounded-xl shadow-sm p-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Menu</h1>
            <p className="text-gray-500 mb-8">Freshly brewed coffee and baked goods.</p>
            
            {/* Nested Grid for Menu Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                  
                  <Button 
                    variant='blue-outline'
                    title='Add to Order'
                    fontBold={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: The Form (Takes up 1 part) */}
        <div className="md:col-span-1">
          {/* 'sticky' keeps the form in view while scrolling the menu */}
          <div className="bg-container rounded-xl shadow-lg p-6 border-t-4 border-blue-600 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Order</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option>Select a table...</option>
                  <option>Table 1</option>
                  <option>Table 2</option>
                  <option>Table 3</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                <textarea 
                  rows={3} 
                  placeholder="No sugar, extra ice..." 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2">
                {/* <button 
                  type="button" 
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Submit Order
                </button> */}
                <Button 
                  variant='blue'
                  title='Submit Order'
                />
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TempMenu