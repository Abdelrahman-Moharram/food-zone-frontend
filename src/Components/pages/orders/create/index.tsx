import Cart from './Cart'
import MenuSectionsList from './MenuSectionsList'

const index = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <MenuSectionsList />
        <Cart />
      </div>
    </div>
  )
}

export default index
