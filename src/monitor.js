import si from "systeminformation";

let lastRx = 0;
let lastTx = 0;
let totalDownloaded = 0;
let totalUploaded = 0;

export function startMonitor(callback) {
  let lastUpdate = Date.now();

  const interval = setInterval(async () => {
    const [net, cpu, mem] = await Promise.all([
      si.networkStats(),
      si.currentLoad(),
      si.mem(),
    ]);

    const rx = net[0].rx_bytes;
    const tx = net[0].tx_bytes;

    const downloadSpeed = (rx - lastRx) / ((Date.now() - lastUpdate) / 1000);
    const uploadSpeed = (tx - lastTx) / ((Date.now() - lastUpdate) / 1000);

    totalDownloaded += rx - lastRx;
    totalUploaded += tx - lastTx;

    lastRx = rx;
    lastTx = tx;
    lastUpdate = Date.now();

    callback({
      cpu: cpu.currentLoad.toFixed(1),
      ram: (mem.used / 1024 / 1024 / 1024).toFixed(2),
      netDown: downloadSpeed,
      netUp: uploadSpeed,
      totalDown: totalDownloaded,
      totalUp: totalUploaded,
      time: Math.floor(process.uptime()),
    });
  }, 1000);

  return interval;
}

export function stopMonitor(interval) {
  clearInterval(interval);
}
