import React from 'react';
import { Settings, Store } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { Header } from '../../../shared/layout/Header/Header';
import { ProfileHeader } from '../components/ProfileHeader';
import { SettingsTab } from '../components/SettingsTab';
import { CarList } from '../components/CarList';
import { CreateListing } from '../components/CreateListing';
import styles from '../styles/Profile.module.css';

export function Profile() {
  const {
    user,
    name,
    roles,
    activeTab,
    listings,
    isLoading,
    isSaving,
    isLoadingListings,
    successMessage,
    error,
    setName,
    becomeSeller,
    saveProfile,
    selectTab,
    deleteCar,
    tagList
  } = useProfile();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando seu perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <p>{error || 'Não foi possivel carregar seu perfil.'}</p>
      </div>
    );
  }

  const isSeller = roles.includes('VENDEDOR');

  return (
    <div className={styles.pageLayout}>
      <Header />
      <div className={styles.container}>
        

        <nav className={styles.tabsNav}>
          <button
            className={`${styles.tabButton} ${activeTab === 'settings' ? styles.activeTab : ''}`}
            onClick={() => selectTab('settings')}
          >
            <Settings size={18} /> Configurações
          </button>

          {isSeller && (
            <button
              className={`${styles.tabButton} ${activeTab === 'listings' ? styles.activeTab : ''}`}
              onClick={() => selectTab('listings')}
            >
              <Store size={18} /> Meus Anúncios
            </button>
          )}

          {isSeller && (
            <button
              className={`${styles.tabButton} ${activeTab === 'create-listing' ? styles.activeTab : ''}`}
              onClick={() => selectTab('create-listing')}
            >
              <Store size={18} /> Criar Anúncio
            </button>
          )}
        </nav>

        <div className={styles.tabContent}>
          {activeTab === 'settings' && (
            <SettingsTab
              name={name}
              setName={setName}
              user={user}
              isSeller={isSeller}
              becomeSeller={becomeSeller}
              saveProfile={saveProfile}
              isSaving={isSaving}
              successMessage={successMessage}
              error={error}
            />
          )}

          {activeTab === 'listings' && isSeller && (
            <CarList
              isLoading={isLoadingListings}
              items={listings}
              deleteCar={deleteCar}
              emptyIcon={Store}
              emptyTitle="Você ainda não possui anúncios"
              emptyDesc="Comece a vender hoje mesmo cadastrando seu primeiro veículo."
            />
          )}

          {activeTab === 'create-listing' && isSeller && (
            <CreateListing tags={tagList} />
          )}
        </div>
      </div>
    </div>
  );
}
