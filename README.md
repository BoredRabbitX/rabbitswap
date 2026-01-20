# Rabbit Swap X - Pro Edition

Advanced Web3 swap interface for Paseo Asset Hub Protocol.

## Project Structure

```
rabbitswap/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # All styles and animations
├── js/
│   ├── config.js           # Configuration constants
│   ├── utils.js            # Utility functions
│   ├── main.js             # Main initialization
│   └── modules/
│       ├── canvas.js       # Background animation
│       ├── wallet.js       # Wallet management
│       ├── claim.js        # Claim functionality
│       └── swap.js         # Swap logic
└── README.md               # This file
```

## Features

### Module 01 - Extraction
- Weekly HOPx token claims
- Cooldown timer display
- PoH (Proof of Humanity) verification game
- Transaction confirmation

### Module 02 - Conversion
- HOPx ↔ RABx token swap
- Dynamic exchange rate
- Token approval handling
- Real-time balance updates
- Direction toggle functionality

## Architecture

### Modular Design
- **CanvasBackground**: Handles particle animation
- **WalletManager**: Manages wallet connections and network switching
- **ClaimManager**: Handles token claiming logic
- **SwapManager**: Manages swap operations and balance updates

### State Management
Centralized state object manages:
- User address
- Web3 provider and signer
- Token balances
- Swap direction

## Configuration

Edit `js/config.js` to modify:
- Token addresses
- Contract addresses
- Network settings
- Exchange rate
- Claim cooldown period

## Usage

1. Open `index.html` in a web browser
2. Connect to Paseo Asset Hub network
3. Link your wallet
4. Claim tokens or perform swaps

## Development

### CSS Variables
Main theme colors defined in `css/style.css`:
- `--bg`: Background color
- `--accent`: Primary accent color
- `--success`: Success state color
- `--error`: Error state color

### Utility Functions
Available in `js/utils.js`:
- `showNotification()`: Display toast notifications
- `showLoading()`/`hideLoading()`: Loading overlay control
- `formatAddress()`: Address formatting
- `parseEther()`/`formatEther()`: Ether value conversion
- `validateInput()`: Input validation

## Browser Requirements

- Modern browser with ES6 support
- Web3 wallet (MetaMask, Trust Wallet, etc.)
- Ethereum provider available

## License

Proprietary - Rabbit Swap Protocol