import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';

export type CustomModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm' | 'loading';

export interface CustomModalProps {
  visible: boolean;
  type?: CustomModalType;
  title: string;
  message: string;
  onClose?: () => void;
  icon?: React.ReactNode;
  primaryButtonText?: string;
  onPrimaryPress?: () => void;
  primaryButtonVariant?: 'primary' | 'danger' | 'gray';
  secondaryButtonText?: string;
  onSecondaryPress?: () => void;
  secondaryButtonVariant?: 'primary' | 'danger' | 'gray';
  loadingColor?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  type = 'info',
  title,
  message,
  onClose,
  icon,
  primaryButtonText,
  onPrimaryPress,
  primaryButtonVariant = 'primary',
  secondaryButtonText,
  onSecondaryPress,
  secondaryButtonVariant = 'gray',
  loadingColor,
}) => {
  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'success':
        return <CheckCircle size={48} color="#10B981" className="mb-4" />;
      case 'error':
        return <XCircle size={48} color="#EF4444" className="mb-4" />;
      case 'warning':
        return <AlertCircle size={48} color="#F59E0B" className="mb-4" />;
      case 'info':
        return <Info size={48} color="#4E71FF" className="mb-4" />;
      case 'confirm':
        return <AlertCircle size={48} color="#F59E0B" className="mb-4" />;
      case 'loading':
        return <ActivityIndicator size="large" color={loadingColor || "#4E71FF"} className="mb-4" />;
      default:
        return null;
    }
  };

  const getButtonClass = (variant: string) => {
    switch (variant) {
      case 'danger':
        return 'bg-[#EF4444]';
      case 'gray':
        return 'bg-gray-100';
      case 'primary':
      default:
        return 'bg-[#4E71FF]';
    }
  };

  const getTextClass = (variant: string) => {
    switch (variant) {
      case 'gray':
        return 'text-gray-700';
      case 'danger':
      case 'primary':
      default:
        return 'text-white';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 items-center w-[80%] max-w-sm shadow-xl">
          {getIcon()}
          
          <Text className="text-xl font-bold text-[#222] text-center mb-2">
            {title}
          </Text>
          
          <Text className="text-base text-[#666] text-center mb-6">
            {message}
          </Text>

          {type !== 'loading' && (
            <View className={`w-full ${secondaryButtonText ? 'flex-row gap-3' : ''}`}>
              {secondaryButtonText && (
                <TouchableOpacity
                  onPress={onSecondaryPress || onClose}
                  className={`flex-1 rounded-xl py-3 items-center ${getButtonClass(secondaryButtonVariant)}`}
                >
                  <Text className={`font-bold text-base ${getTextClass(secondaryButtonVariant)}`}>
                    {secondaryButtonText}
                  </Text>
                </TouchableOpacity>
              )}
              {primaryButtonText && (
                <TouchableOpacity
                  onPress={onPrimaryPress || onClose}
                  className={`${secondaryButtonText ? 'flex-1' : 'w-full'} rounded-xl py-3 items-center ${getButtonClass(primaryButtonVariant)}`}
                >
                  <Text className={`font-bold text-base ${getTextClass(primaryButtonVariant)}`}>
                    {primaryButtonText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
