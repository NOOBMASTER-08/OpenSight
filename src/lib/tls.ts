import tls from 'tls';

export function tlsRecon(domain: string) {
  return new Promise((resolve) => {
    const socket = tls.connect(443, domain, { servername: domain }, () => {
      resolve(socket.getPeerCertificate());
      socket.end();
    });
  });
}
